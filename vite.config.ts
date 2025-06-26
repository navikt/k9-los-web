import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			include: [/\.jsx$/, /\.tsx?$/],
		}),
	],
	resolve: {
		alias: {
			app: path.resolve(__dirname, './src/client/app/app'),
			api: path.resolve(__dirname, './src/client/app/api'),
			form: path.resolve(__dirname, './src/client/app/form'),
			hooks: path.resolve(__dirname, './src/client/app/hooks'),
			kodeverk: path.resolve(__dirname, './src/client/app/kodeverk'),
			navAnsatt: path.resolve(__dirname, './src/client/app/navAnsatt'),
			sharedComponents: path.resolve(__dirname, './src/client/app/sharedComponents'),
			avdelingsleder: path.resolve(__dirname, './src/client/app/avdelingsleder'),
			saksbehandler: path.resolve(__dirname, './src/client/app/saksbehandler'),
			filter: path.resolve(__dirname, './src/client/app/filter'),
			types: path.resolve(__dirname, './src/client/app/types'),
			utils: path.resolve(__dirname, './src/client/app/utils'),
			styles: path.resolve(__dirname, './src/client/styles'),
		},
	},
	server: {
		port: 8031,
		proxy: {
			'/envVariables': {
				target: 'http://localhost:8030',
				changeOrigin: true,
			},
			'/api/k9-los-api': {
				target: 'http://localhost:8020',
				changeOrigin: true,
				secure: false,
				rewrite: (reqPath) => reqPath.replace(/^\/api\/k9-los-api/, '/api'),
			},
		},
	},
	build: {
		outDir: 'dist',
	},
	root: 'src/client',
});
