/** @type {import('jest').Config} */
const config = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  moduleNameMapper: {
    "@shared-components(.*)":
      "<rootDir>projects/shared-components/src/public-api.ts",
  },
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  projects: ["<rootDir>/projects/*"],
};

module.exports = config;
