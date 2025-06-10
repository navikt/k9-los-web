declare global {
	interface Window {
		env: {
			OIDC_PROXY_URL?: string;
			SOKEBOKS_NYE_KOER?: string;
			SAKSBEHANDLER_KAN_VELGE_NYE_KOER?: string;
			AVDELINGSLEDER_TILGANG_TIL_NYE_KOER?: string;
		};
	}
}

interface EnvVariable {
	key: string;
	value: string;
}

interface EnvVariables {
	SOKEBOKS_NYE_KOER: string;
	SAKSBEHANDLER_KAN_VELGE_NYE_KOER: string;
	AVDELINGSLEDER_TILGANG_TIL_NYE_KOER: string;
}

export const setEnvVariables = async () => {
	try {
		const response = await fetch('/envVariables');
		const data: EnvVariable[] = await response.json();
		const envVariables = data.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}) as EnvVariables;
		window.env = window?.env || {};
		window.env.SOKEBOKS_NYE_KOER = envVariables.SOKEBOKS_NYE_KOER;
		window.env.SAKSBEHANDLER_KAN_VELGE_NYE_KOER = envVariables.SAKSBEHANDLER_KAN_VELGE_NYE_KOER;
		window.env.AVDELINGSLEDER_TILGANG_TIL_NYE_KOER = envVariables.AVDELINGSLEDER_TILGANG_TIL_NYE_KOER;
	} catch (error) {
		console.error('Failed to set environment variables', error);
		throw error;
	}

	return Promise.resolve();
};

export const sokeboksNyeKoer = () => window?.env?.SOKEBOKS_NYE_KOER === 'enabled';
export const saksbehandlerKanVelgeNyeKoer = () => window?.env?.SAKSBEHANDLER_KAN_VELGE_NYE_KOER === 'enabled';
export const avdelingslederTilgangTilNyeKoer = () => window?.env?.AVDELINGSLEDER_TILGANG_TIL_NYE_KOER === 'enabled';
