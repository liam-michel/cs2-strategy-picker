import baseConfig from '../../eslint.config.js'
import { plugin as ex } from 'eslint-plugin-exception-handling'
import toplevel from 'eslint-plugin-toplevel'

export default [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    ignores: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: {
      ex,
      toplevel,
    },
    rules: {
      'no-console': 'error',

      'toplevel/no-toplevel-side-effect': 'error',
      'toplevel/no-toplevel-var': 'error',
      'toplevel/no-toplevel-let': 'error',

      'ex/no-unhandled': 'error',
      'ex/use-error-cause': 'error',
    },
  },
]
