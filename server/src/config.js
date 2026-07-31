import 'dotenv/config';
import logger from './log.js';

const envVar = ({ name, required = true }) => {
	if (!process.env[name] && required) {
		logger.error(`Missing required environment variable '${name}'`);
		process.exit(1);
	}
	return process.env[name];
};

const server = {
	// should be equivalent to the URL this application is hosted on for correct CORS origin header
	host:
		envVar({
			name: 'HOST',
			required: false,
		}) || 'localhost',

	// port for your application
	port:
		envVar({
			name: 'PORT',
			required: false,
		}) || 8030,
};

const cors = {
	allowedHeaders:
		envVar({
			name: 'CORS_ALLOWED_HEADERS',
			required: false,
		}) || 'Nav-CallId',
	exposedHeaders:
		envVar({
			name: 'CORS_EXPOSED_HEADERS',
			required: false,
		}) || '',
	allowedMethods:
		envVar({
			name: 'CORS_ALLOWED_METHODS',
			required: false,
		}) || '',
};

export const configValueAsJson = ({ name, required = true }) => {
	const value = envVar({ name, required });
	if (!value) {
		return null;
	}
	try {
		return JSON.parse(value);
	} catch (error) {
		logger.error(`Config: '${name}' er ikke et gyldig JSON-objekt.`, error);
		process.exit(1);
	}
};

const getProxyConfig = () => {
	const config = configValueAsJson({ name: 'PROXY_CONFIG' });
	if (!config.apis) {
		logger.error("Config: 'PROXY_CONFIG' mangler 'apis' entry.");
		process.exit(1);
	}
	config.apis.forEach((entry, index) => {
		if (!entry.path) {
			logger.error(`Api entry ${index} mangler 'path'`);
			process.exit(1);
		}
		if (!entry.url) {
			logger.error(`Api entry ${index} mangler 'url'`);
			process.exit(1);
		}
		// Overgangsordning: 'auth' ble innført etter at PROXY_CONFIG allerede var i bruk
		// i k9-verdikjede. Entries uten 'auth' tolkes som 'obo', slik at gammel og ny
		// konfigurasjon kan leve side om side mens begge repoene rulles ut.
		// TODO: krev 'auth' eksplisitt når k9-verdikjede er oppdatert.
		if (entry.auth === undefined) {
			logger.warning(`Api entry ${index} mangler 'auth', antar 'obo'. Sett 'auth' eksplisitt.`);
			entry.auth = 'obo';
		}
		if (!['none', 'obo'].includes(entry.auth)) {
			logger.error(`Api entry ${index} har ugyldig 'auth'. Gyldige verdier: 'none', 'obo'`);
			process.exit(1);
		}
		if (entry.auth === 'obo' && !entry.scopes) {
			logger.error(`Api entry ${index} mangler 'scopes'`);
			process.exit(1);
		}
		if (entry.auth === 'none' && entry.scopes) {
			logger.error(`Api entry ${index} med 'auth: none' skal ikke ha 'scopes'`);
			process.exit(1);
		}
	});

	return config;
};

export default {
	server,
	reverseProxyConfig: getProxyConfig(),
	cors,
};
