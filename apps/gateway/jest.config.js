const config = {
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.ts'],
  setupFiles: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/gateway',
};

module.exports = config;
