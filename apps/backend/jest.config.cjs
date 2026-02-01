const { pathsToModuleNameMapper } = require('ts-jest')

module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.cjs'],
  testPathIgnorePatterns: ['<rootDir>/build/'],
  modulePathIgnorePatterns: ['<rootDir>/build'],
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '~/*': ['./src/*'],
    },
    {
      prefix: '<rootDir>/',
      useESM: true,
    },
  ),
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
}
