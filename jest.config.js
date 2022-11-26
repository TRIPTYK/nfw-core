/** @type {import('ts-jest').JestConfigWithTsJest} */

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
    testMatch: [`<rootDir>/packages/${name}/tests/**/*.test.ts`],
    ...ESMPreset,
  };
}

export default {
  testEnvironment: "node",
  collectCoverage: Boolean(process.env.CI),
  ...ESMPreset,
  projects: [
    createProject("mikro-orm"),
    createProject("core"),
    createProject("http"),
    createProject("jsonapi"),
  ],
};
