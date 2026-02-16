// eslint.config.js

import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { configs as sonarjsConfigs } from 'eslint-plugin-sonarjs'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'

export default tseslint.config(
  {
    ignores: ['**/*.cjs', 'node_modules/**', 'build/**', 'tmp/**'],
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      sonarjsConfigs.recommended,
      eslintConfigPrettier,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'sonarjs/no-unused-vars': 'off',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
)
