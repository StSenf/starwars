/** @type {import('jest').Config} */
const config = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>../../setup-jest.ts"],
  moduleNameMapper: {
    "@shared-components(.*)": "<rootDir>../shared-components/src/public-api.ts",
  },
  displayName: {
    name: "SLING",
    color: "green",
  },
};

module.exports = config;
