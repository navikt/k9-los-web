import { defineConfig } from 'orval';

export default defineConfig({
	los: {
		hooks: {
			afterAllFilesWrite: 'biome check --write src/client/app/api/generated',
		},
		input: {
			target: process.env.OPENAPI_URL ?? 'http://localhost:8020/openapi.json',
			override: {
				transformer: 'scripts/openapiTransformer.ts',
			},
		},
		output: {
			client: 'react-query',
			httpClient: 'axios',
			mode: 'split',
			target: 'src/client/app/api/generated/los.ts',
			clean: true,
			override: {
				mutator: {
					path: 'src/client/app/api/orvalMutator.ts',
					name: 'losClient',
				},
				query: {
					shouldExportKeys: true,
					signal: true,
				},
			},
		},
	},
});
