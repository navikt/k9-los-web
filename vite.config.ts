/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [
		react(),
		{
			name: 'endringslogg-mock',
			configureServer(server) {
				server.middlewares.use('/api/endringslogg', (request, response, next) => {
					if (request.method !== 'POST') {
						next();
						return;
					}

					response.setHeader('Content-Type', 'application/json');
					response.end(JSON.stringify([{ title: 'Test av nyhet', seen: true, date: new Date().toISOString() }]));
				});
			},
		},
	],
	resolve: {
		tsconfigPaths: true,
	},
	server: {
		port: 8031,
		strictPort: true,
		proxy: {
			'/api/k9-los-api': {
				target: 'http://localhost:8020',
				rewrite: (path) => path.replace(/^\/api\/k9-los-api/, '/api'),
			},
		},
	},
	build: {
		assetsDir: 'public',
		sourcemap: true,
	},
	test: {
		globals: true,
		environment: 'jsdom',
		// msw krever at pakkens «browser»-eksport ikke velges under jsdom.
		environmentOptions: {
			jsdom: {
				customExportConditions: [''],
			},
		},
		setupFiles: ['./setup/setup.js', './setup/setup-test-env.ts'],
		include: ['src/**/*.spec.{js,jsx,ts,tsx}'],
		exclude: ['**/node_modules/**', '**/dist/**', 'src/client/tests/**'],
		server: {
			deps: {
				// @navikt/endringslogg publiserer ESM med en extensionless relativ import
				// (./endringslogg-container) som Node ikke kan resolve, og må derfor
				// bundles av Vite. Under Jest ble den transpilert til CJS, som tillater det.
				//
				// Bieffekt: pakkens sourcemaps peker på kildefiler som ikke er publisert,
				// så Vite logger «points to missing source files» per modul. Ufarlig,
				// og kan fjernes når pakken fikser publiseringen.
				inline: ['@navikt/endringslogg'],
			},
		},
	},
});
