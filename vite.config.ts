/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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
		environment: 'jsdom',
		setupFiles: ['./setup/setup-test-env.ts'],
		include: ['src/**/*.spec.{js,jsx,ts,tsx}'],
		env: { TZ: 'Europe/Oslo' },
		restoreMocks: true,
		coverage: {
			exclude: ['**/testdata.ts', '**/*.d.ts', '**/*.spec.*', 'setup/**'],
		},
	},
});
