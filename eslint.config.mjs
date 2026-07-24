import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'dist/',
			'build/',
			'node_modules/',
			'coverage/',
			'**/*.d.ts',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat['jsx-runtime'],
	jsxA11y.flatConfigs.recommended,
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		settings: {
			react: { version: 'detect' },
			'import/resolver': {
				typescript: {},
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
					moduleDirectory: ['node_modules', 'src/'],
				},
			},
		},
		plugins: {
			'react-hooks': reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,

			// react-hooks v7 introduserte flere nye regler som krever omfattende
			// refactoring av eksisterende komponenter. Demp til 'warn' inntil
			// videre slik at de er synlige uten å blokkere.
			'react-hooks/set-state-in-effect': 'warn',
			'react-hooks/refs': 'warn',
			'react-hooks/use-memo': 'warn',
			'react-hooks/incompatible-library': 'warn',
			'react-hooks/preserve-manual-memoization': 'warn',
			'react-hooks/purity': 'warn',
			'react-hooks/static-components': 'warn',
			'react-hooks/unsupported-syntax': 'warn',
			'react-hooks/component-hook-factories': 'warn',
			'react-hooks/error-boundaries': 'warn',
			'react-hooks/gating': 'warn',
			'react-hooks/globals': 'warn',
			'react-hooks/immutability': 'warn',

			'import/no-extraneous-dependencies': 'off',
			'import/no-unresolved': 'error',
			'import/prefer-default-export': 'off',
			'import/extensions': 'off',

			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-use-before-define': 'error',
			'@typescript-eslint/no-shadow': 'error',
			'no-shadow': 'off',

			'max-len': ['warn', 160],

			'react/jsx-filename-extension': [
				'warn',
				{ extensions: ['.js', '.jsx', '.ts', '.tsx'] },
			],
			'react/jsx-props-no-spreading': 'off',
			'react/destructuring-assignment': 'off',
			'react/function-component-definition': 'off',
			'react/require-default-props': 'off',
			'react/prop-types': 'off',

			'jsx-a11y/control-has-associated-label': 'off',
		},
	},
	{
		files: ['**/*.spec.ts', '**/*.spec.tsx'],
		plugins: {
			jest: jestPlugin,
			'jest-dom': jestDom,
		},
		rules: {
			...jestPlugin.configs.recommended.rules,
			...jestDom.configs.recommended.rules,
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
);
