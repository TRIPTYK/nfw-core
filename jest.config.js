export default {
  testEnvironment: "node",
  collectCoverage: Boolean(process.env.CI),
  projects: [
    {
      displayName: "nfw-mikro-orm",
      testMatch: ["<rootDir>/packages/mikro-orm/dist/tests/**/*.test.js"],
    },
    {
      displayName: "nfw-core",
      testMatch: ["<rootDir>/packages/core/dist/tests/**/*.test.js"],
    },
    {
      displayName: "nfw-http",
      testMatch: ["<rootDir>/packages/http/dist/tests/**/*.test.js"],
    },
    {
      displayName: "nfw-jsonapi",
      testMatch: ["<rootDir>/packages/jsonapi/dist/tests/**/*.test.js"],
    },
  ],
};
