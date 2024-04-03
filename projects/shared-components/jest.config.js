/** @type {import('jest').Config} */
const config = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>../../setup-jest.ts"],
  displayName: {
    name: "SHARED_COMPONENTS",
    color: "magenta",
  },
};

module.exports = config;
