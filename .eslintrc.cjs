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
		"@typescript-eslint/no-unused-vars": ["warn"]
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
