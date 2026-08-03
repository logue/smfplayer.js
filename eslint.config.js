import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';

const importOrderRule = [
  'error',
  {
    groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
    pathGroups: [
      {
        pattern: '{vite,vitest,vitest/**,@vitejs/**}',
        group: 'external',
        position: 'before',
      },
      {
        pattern: '{@/**}',
        group: 'internal',
        position: 'before',
      },
    ],
    pathGroupsExcludedImportTypes: ['builtin'],
    alphabetize: { order: 'asc' },
    'newlines-between': 'always',
  },
];

const resolverSettings = {
  'import-x/resolver': {
    typescript: true,
    node: true,
    'eslint-import-resolver-custom-alias': {
      alias: { '@': './src', '~': './node_modules' },
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
    },
  },
};

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '.vscode/',
      'dist/',
      'public/',
      'docs/',
      'src/**/*.generated.*',
      'eslint.config.js',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        __APP_VERSION__: 'readonly',
        __BUILD_DATE__: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
  importPlugin.flatConfigs.recommended,
  // JavaScript files
  {
    files: ['**/*.{js,mjs,cjs}'],
    settings: resolverSettings,
    languageOptions: {
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    rules: {
      'no-unused-vars': 'off',
      'import-x/default': 'off',
      'import-x/namespace': 'off',
      'import-x/no-default-export': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/order': importOrderRule,
    },
  },
  // TypeScript files
  {
    files: ['**/*.ts'],
    plugins: { '@typescript-eslint': tseslint },
    settings: resolverSettings,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'import-x/default': 'off',
      'import-x/namespace': 'off',
      'import-x/no-default-export': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/order': importOrderRule,
    },
  },
  eslintConfigPrettier,
];
