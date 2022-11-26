/** @type {import('ts-jest').JestConfigWithTsJest} */

function createProject(name) {
  return {
    displayName: name,
    testMatch: [`<rootDir>/packages/${name}/tests/**/*.test.ts`],
    tsConfig: `<rootDir>/packages/${name}/tsconfig.json`,
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
}

export default {
  testEnvironment: "node",
  collectCoverage: Boolean(process.env.CI),
  projects: [
    createProject("mikro-orm"),
    createProject("core"),
    createProject("http"),
    createProject("jsonapi"),
  ],
};
