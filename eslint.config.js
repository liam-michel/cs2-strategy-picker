// @ts-check

import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import { plugin as ex } from 'eslint-plugin-exception-handling'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { configs as sonarjsConfigs } from 'eslint-plugin-sonarjs'
import toplevel from 'eslint-plugin-toplevel'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['**/*.cjs', 'node_modules/**', 'build/**', 'extension/**', '**/__test__/**', 'tmp/**'],
  },
  {
    files: ['**/*.ts'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      toplevel: toplevel,
      ex,
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      sonarjsConfigs.recommended, // Updated to use the imported alias
      eslintConfigPrettier,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_*', varsIgnorePattern: '_*' }],
      'sonarjs/no-unused-vars': 'off',
      'sonarjs/todo-tag': 'warn',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'toplevel/no-toplevel-side-effect': 'error',
      'toplevel/no-toplevel-var': 'error',
      'toplevel/no-toplevel-let': 'error',
      'ex/might-throw': 'off',
      'ex/no-unhandled': 'error',
      'ex/use-error-cause': 'error',
      'no-console': 'error',
      //no unused imports
      'no-unused-vars': 'off',
    },
  },
)
