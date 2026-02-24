import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { decodeJwt } from 'jose';
import { validateToken } from '@navikt/oasis';
import config from './src/config.js';
import logger from './src/log.js';
import reverseProxy from './src/reverse-proxy.js';

const server = express();
const { port } = config.server;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 1 hour
	max: 1000, // limit each IP to 1000 requests per windowMs
});

async function startApp() {
	try {
		// Logging i json format
		server.use(logger.morganMiddleware);

		server.set('trust proxy', 1);

		server.use(
			helmet({
				contentSecurityPolicy: {
					useDefaults: false,
					directives: {
						'default-src': ["'self'", "'unsafe-inline'"],
						'base-uri': ["'self'"],
						'connect-src': [
							"'self'",
							'https://sentry.gc.nav.no',
							'https://familie-endringslogg.intern.dev.nav.no',
							'https://familie-endringslogg.intern.nav.no',
							process.env.NAIS_FRONTEND_TELEMETRY_COLLECTOR_URL,
						],
						'font-src': ["'self'", 'https://cdn.nav.no', 'data:'],
						'img-src': ["'self'", 'data:', 'blob:'],
						'style-src': ["'self'", "'unsafe-inline'"],
						'frame-src': ["'self'"],
						'child-src': ["'self'"],
						'media-src': ["'none'"],
						'object-src': ["'none'"],
					},
				},
				referrerPolicy: { policy: 'origin' },
				hidePoweredBy: true,
				noSniff: true,
			}),
		);

		// CORS konfig
		server.use(
			cors({
				origin: config.server.host,
				methods: config.cors.allowedMethods,
				exposedHeaders: config.cors.exposedHeaders,
				allowedHeaders: config.cors.allowedHeaders,
			}),
		);

		// Liveness and readiness probes for Kubernetes / nais
		server.get('/health/isAlive', (req, res) => {
			res.status(200).send('Alive');
		});
		server.get('/health/isReady', (req, res) => {
			res.status(200).send('Ready');
		});

		server.get(['/oauth2/login'], async (req, res) => {
			res.status(502).send({
				message: 'Wonderwall must handle /oauth2/login',
			});
		});
		const ensureAuthenticated = async (req, res, next) => {
			if (process.env.IS_VERDIKJEDE === 'true') {
				next();
				return;
			}
			try {
				const token = req.headers.authorization.replace('Bearer ', '');

				if (!token) {
					logger.debug('User token missing. Redirecting to login.');
					res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
				}
				const validation = await validateToken(token);

				if (!validation.ok) {
					logger.debug('User token not valid. Redirecting to login.');
					res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
				} else {
					logger.debug('User token is valid. Continue.');
					next();
				}
			} catch (error) {
				logger.error('Error getting session:', error);
				res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
			}
		};

		// The routes below require the user to be authenticated
		server.use(ensureAuthenticated);

		server.get(['/logout'], async (req, res) => {
			if (req.headers.authorization) {
				res.redirect('/oauth2/logout');
			}
		});

		server.get('/me', (req, res) => {
			const user = decodeJwt(req.headers.authorization);
			res.send({
				name: user.name,
			});
		});

		reverseProxy.setup(server);

		// serve static files
		const rootDir = './dist';
		server.use('/public', express.static('./dist/public'));
		server.use(/^\/(?!.*dist)(?!api).*$/, limiter, (req, res) => {
			res.sendFile('index.html', { root: rootDir });
		});

		server.listen(port, (error) => {
			if (error) {
				throw error;
			}
			logger.info(`Listening on port ${port}`);
		});
	} catch (error) {
		logger.error('Error during start-up: ', error);
	}
}

startApp().catch((err) => logger.error(err));
