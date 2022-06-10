export default {
  testEnvironment: 'node',
  projects: [{
    displayName: 'nfw-core-mikro-orm',
    testMatch: ['<rootDir>/packages/mikro-orm/dist/tests/**/*.test.js']
  }, {
    displayName: 'nfw-core',
    testMatch: ['<rootDir>/packages/core/dist/tests/**/*.test.js']
  }]
};
