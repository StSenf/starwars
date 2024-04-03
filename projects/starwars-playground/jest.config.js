/** @type {import('jest').Config} */
const config = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>../../setup-jest.ts"],
  moduleNameMapper: {
    "@shared-components(.*)": "<rootDir>../shared-components/src/public-api.ts",
  },
  displayName: {
    name: "STAR_WARS",
    color: "yellow",
  },
};

module.exports = config;
