const ESMPreset = {
  preset: "ts-jest/presets/default-esm", // or other ESM presets
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};

function createProject(name) {
  return {
    displayName: name,
    coveragePathIgnorePatterns: [`<rootDir>/packages/${name}/tests/.*`],
    collectCoverageFrom: [`packages/${name}/src/**/*.ts`],
    testMatch: [`<rootDir>/packages/${name}/tests/**/*.test.ts`],
    ...ESMPreset,
  };
}

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: "node",
  collectCoverage: Boolean(process.env.CI),
  projects: [
    createProject("mikro-orm"),
    createProject("core"),
    createProject("http"),
    createProject("jsonapi"),
    createProject("jsonapi-new"),
  ],
};
