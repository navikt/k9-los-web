export default {
	projects: [
		{
			displayName: 'test',
			cacheDirectory: '<rootDir>/jest_cache/',
			moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'css'],
			moduleNameMapper: {
				'\\.(svg)$': '<rootDir>/setup/fileMock.js',
				'\\.css$': 'identity-obj-proxy',
			},
			roots: ['<rootDir>/src'],
			setupFiles: ['<rootDir>/setup/setup.js'],
			setupFilesAfterEnv: ['<rootDir>/setup/setup-test-env.ts'],
			testEnvironment: 'jest-fixed-jsdom',
			testEnvironmentOptions: {
				customExportConditions: [''],
			},
			testMatch: ['**/?(*.)+(spec).+(js|jsx|ts|tsx)'],
			testPathIgnorePatterns: ['/node_modules/', '/dist/', '<rootDir>/src/client/tests/'],
			transform: {
				'^.+\\.(ts|tsx|js|jsx|mjs)?$': 'babel-jest',
				'^.+\\.css$': 'jest-transform-stub',
			},
			// react-router 8 (og dens dependency cookie-es) er ESM-only – ingen CJS-build.
			// De må derfor transpileres av babel-jest i stedet for å ignoreres.
			transformIgnorePatterns: [
				'<rootDir>.*(node_modules)(?!.*(nav|uuid|@portabletext|until-async|rettime|msw|@open-draft|react-router|cookie-es).*).*$',
			],
			// ignore tests in tests folder
			moduleDirectories: ['node_modules', 'src/client', 'src/client/app'],
		},
	],
};
