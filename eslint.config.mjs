import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	...compat.extends('airbnb', 'plugin:@typescript-eslint/recommended', 'prettier'),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
			'react-hooks': fixupPluginRules(reactHooks),
		},

		languageOptions: {
			globals: {
				...globals.browser,
			},

			parser: tsParser,
			ecmaVersion: 5,
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					ecmaVersion: 8,
					jsx: true,
					impliedStrict: true,
				},
			},
		},

		settings: {
			'import/resolver': {
				typescript: {},

				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx', '.less', '.scss'],
					moduleDirectory: ['node_modules', 'src/'],
				},
			},
		},

		rules: {
			'import/no-extraneous-dependencies': 0,

			'import/no-unused-modules': [
				1,
				{
					unusedExports: true,
					missingExports: true,
					ignoreExports: [],
				},
			],

			'import/no-unresolved': 'error',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-use-before-define': 'error',
			'@typescript-eslint/no-shadow': 'error',

			'react/jsx-filename-extension': [
				1,
				{
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
			],

			'no-shadow': 'off',
			'max-len': [1, 160],
			'react/jsx-props-no-spreading': 'off',
			'react/destructuring-assignment': 'off',
			'jsx-a11y/control-has-associated-label': 'off',
			'react/function-component-definition': 'off',
			'implicit-arrow-linebreak': 'off',
			'function-paren-newline': 'off',
			'arrow-parens': 'off',
			'object-curly-newline': 'off',
			'react/require-default-props': 'off',
			'react/prop-types': 'off',
			'import/prefer-default-export': 'off',
			'import/extensions': 'off',
			'react/react-in-jsx-scope': 'off',
		},
	},
	{
		files: ['**/*.spec.ts', '**/*.spec.tsx'],

		rules: {
			'@typescript-eslint/no-explicit-any': 0,
			'import/no-unused-modules': 0,
		},
	},
];
