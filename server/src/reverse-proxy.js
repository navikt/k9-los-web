import proxy from 'express-http-proxy';
import url from 'url';
import { requestOboToken, validateToken } from '@navikt/oasis';
import config, { configValueAsJson } from './config.js';
import log from './log.js';

const xTimestamp = 'x-Timestamp';
const stripTrailingSlash = (str) => (str.endsWith('/') ? str.slice(0, -1) : str);

const proxyOptions = (api) => ({
	timeout: 20000,
	proxyReqOptDecorator: async (options, req) => {
		log.info(`Proxy request started for ${req.originalUrl}`);

		if (process.env.IS_VERDIKJEDE === 'true') {
			log.info('IS_VERDIKJEDE is true, skipping token processing.');
			return options;
		}
		if (!api.scopes) {
			// Ikke et kall som krever token, returner options som de er
			return options;
		}
		try {
			const token = req.headers.authorization.replace('Bearer ', '');
			const validationResult = await validateToken(token);
			if (!validationResult.ok) {
				log.error('Token validation failed:', validationResult.error);
			}
			const requestTime = Date.now();
			options.headers[xTimestamp] = requestTime;
			delete options.headers.cookie;

			return new Promise((resolve, reject) => {
				log.debug(`Requesting OBO token for scopes: ${api.scopes}`);
				requestOboToken(token, api.scopes).then(
					(obo) => {
						if (!obo.ok) {
							log.error('Error getting OBO token:', obo.error);
							reject(obo.error);
						}
						options.headers.Authorization = `Bearer ${obo.token}`;
						log.info(
							`Sending request to ${api.url} with path ${req.originalUrl} at ${new Date(requestTime).toISOString()}`,
						);
						resolve(options);
					},
					(error) => {
						log.error('Error during OBO token request:', error);
						reject(error);
					},
				);
			});
		} catch (error) {
			log.error('Error in proxyReqOptDecorator:', error);
			throw error; // re-throw the error so it can be handled by the caller
		}
	},
	proxyReqPathResolver: (req) => {
		const urlFromApi = url.parse(api.url);
		const pathFromApi = urlFromApi.pathname === '/' ? '' : urlFromApi.pathname;
		const urlFromRequest = url.parse(req.originalUrl);
		let path = urlFromRequest.pathname;

		log.debug(`Resolving proxy path for request: ${req.originalUrl}`);

		const PROXY_CONFIG = configValueAsJson({ name: 'PROXY_CONFIG' });
		PROXY_CONFIG.apis.forEach((proxyEntry) => {
			if (proxyEntry.backendPath !== undefined) {
				log.debug(`Replacing path ${proxyEntry.path} with ${proxyEntry.backendPath}`);
				path = path.replace(proxyEntry.path, proxyEntry.backendPath);
			}
		});
		const queryString = urlFromRequest.query;
		const newPath = (pathFromApi || '') + (path || '') + (queryString ? `?${queryString}` : '');
		log.info(`Proxying request from '${req.originalUrl}' to '${stripTrailingSlash(urlFromApi.href)}${newPath}'`);
		return newPath;
	},
	userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
		const { statusCode } = proxyRes;
		const requestTime = Date.now() - proxyReq.getHeader(xTimestamp);
		const melding = `${statusCode} ${proxyRes.statusMessage}: ${userReq.method} - ${userReq.originalUrl} (${requestTime}ms)`;
		if (statusCode >= 500) {
			log.warning(melding);
		} else {
			log.info(melding);
		}
		return headers;
	},
	proxyErrorHandler(err, res, next) {
		log.error('Proxy error:', err);
		console.error(err.code);
		console.error(err.message);

		switch (err && err.code) {
			case 'ENOTFOUND': {
				log.warning(`${err}, with code: ${err.code}`);
				return res.status(404).send();
			}
			case 'ECONNRESET': {
				log.error('Connection reset error.');
				return res.status(504).send();
			}
			case 'ECONNREFUSED': {
				log.error('Connection refused.');
				return res.status(500).send();
			}
			default: {
				log.error(`Unhandled error: ${err}, code: ${err.code}`);
				next(err);
			}
		}
	},
});

// eslint-disable-next-line func-names
const timedOut = function (req, res, next) {
	if (!req.timedout) {
		next();
	} else {
		log.warning(`Request for ${req.originalUrl} timed out!`);
	}
};

const setup = (router) => {
	log.info('Setting up proxies...');
	config.reverseProxyConfig.apis.forEach((api) => {
		router.use(`${api.path}/*`, timedOut, proxy(api.url, proxyOptions(api)));
		log.info(`Proxy set up: ${api.path}/* -> ${api.url}`);
	});
};

export default { setup };
