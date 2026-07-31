import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let exit;

const lastConfig = async (proxyConfig) => {
	vi.resetModules();
	process.env.PROXY_CONFIG = JSON.stringify(proxyConfig);
	const modul = await import('../../server/src/config.js');
	return modul.default.reverseProxyConfig;
};

describe('PROXY_CONFIG-validering', () => {
	beforeEach(() => {
		// process.exit må mockes i alle testene: en regresjon i valideringen ville
		// ellers drept test-workeren i stedet for å gi en feilende test.
		exit = vi.spyOn(process, 'exit').mockImplementation(() => undefined);
	});

	afterEach(() => {
		delete process.env.PROXY_CONFIG;
		vi.restoreAllMocks();
	});

	it('tolker entry uten auth som obo, slik at gammel config fortsatt virker', async () => {
		const config = await lastConfig({
			apis: [{ path: '/api/k9-los-api', url: 'http://k9-los-api', scopes: 'api://k9-los-web/.default' }],
		});

		expect(config.apis[0].auth).toBe('obo');
		expect(exit).not.toHaveBeenCalled();
	});

	it('beholder eksplisitt auth', async () => {
		const config = await lastConfig({
			apis: [
				{ path: '/api/k9-los-api', url: 'http://k9-los-api', auth: 'obo', scopes: 'api://k9-los-web/.default' },
				{ path: '/api/endringslogg', url: 'http://endringslogg', auth: 'none', backendPath: '' },
			],
		});

		expect(config.apis.map((api) => api.auth)).toEqual(['obo', 'none']);
		expect(exit).not.toHaveBeenCalled();
	});

	it('avslutter ved ugyldig auth', async () => {
		await lastConfig({ apis: [{ path: '/api/noe', url: 'http://noe', auth: 'tulleverdi' }] });

		expect(exit).toHaveBeenCalledWith(1);
	});

	it('avslutter når obo-entry mangler scopes', async () => {
		await lastConfig({ apis: [{ path: '/api/noe', url: 'http://noe', auth: 'obo' }] });

		expect(exit).toHaveBeenCalledWith(1);
	});

	it('avslutter når none-entry har scopes', async () => {
		await lastConfig({ apis: [{ path: '/api/noe', url: 'http://noe', auth: 'none', scopes: 'api://noe' }] });

		expect(exit).toHaveBeenCalledWith(1);
	});
});
