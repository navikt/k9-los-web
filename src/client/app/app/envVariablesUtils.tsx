declare global {
	interface Window {
		env: {
			OIDC_PROXY_URL?: string;
			EXAMPLE?: string;
		};
	}
}

interface EnvVariable {
	key: string;
	value: string;
}

interface EnvVariables {
	EXAMPLE: string;
}

export const setEnvVariables = async () => {
	try {
		const response = await fetch('/envVariables');
		const data: EnvVariable[] = await response.json();
		const envVariables = data.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}) as EnvVariables;
		window.env = window?.env || {};
		window.env.EXAMPLE = envVariables.EXAMPLE;
	} catch (error) {
		console.error('Failed to set environment variables', error);
		throw error;
	}

	return Promise.resolve();
};
