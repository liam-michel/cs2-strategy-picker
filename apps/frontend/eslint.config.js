import baseConfig from '../../eslint.config.js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      globals: {
        window: true,
        document: true,
      },
    },
    rules: {
      // React rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Frontend realities
      'no-console': 'warn',

      // MUST be off for React
      'toplevel/no-toplevel-side-effect': 'off',
      'toplevel/no-toplevel-var': 'off',
      'toplevel/no-toplevel-let': 'off',
    },
  },
]
