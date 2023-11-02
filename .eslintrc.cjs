/**
 *
 * @type {import("eslint").Linter.Config}
 */
const config = {
	root: true,

	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	rules: {
		"@typescript-eslint/consistent-type-imports": ["error", {
			"prefer": "type-imports",
			"fixStyle": "inline-type-imports"
		}],
		"@typescript-eslint/no-unused-vars": ["warn"],
		"@typescript-eslint/no-explicit-any": ["off"],
		"@typescript-eslint/no-empty-function": ["off"],
		"@typescript-eslint/no-empty-interface": ["off"],
		"@typescript-eslint/ban-ts-comment": ["off"],
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};

module.exports = config;
