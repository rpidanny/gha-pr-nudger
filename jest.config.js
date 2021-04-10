const baseConfig = require('./jest-base')

module.exports = {
  ...baseConfig,
  rootDir: '.',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  testPathIgnorePatterns: ['<rootDir>/src/__mocks__/*'],
  setupFilesAfterEnv: ['./__tests__/setup-test.js'],
  cacheDirectory: '<rootDir>/.cache/unit',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!**/node_modules/**', '!**/vendor/**'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: [['lcov', { projectRoot: './' }], 'text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
