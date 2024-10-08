// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  testRegex: ".*\\.spec\\.tsx?$",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^app/(.*)": "<rootDir>/src/$1",
    "^tests/(.*)": "<rootDir>/tests/$1",
    "^@tests/(.*)$": "<rootDir>/tests/api/$1",
    "^@/(.*)$": "<rootDir>/src/api/$1",
  },
  // testEnvironment: "jsdom",
  reporters: ["default", "jest-junit"],
  collectCoverageFrom: ["<rootDir>/src/**/*.(t|j)s?(x)"],
  coverageReporters: ["text", "text-summary", "lcov"],
  coveragePathIgnorePatterns: ["<rootDir>/src/generated", "<rootDir>/tests"],
  coverageDirectory: "<rootDir>/coverage",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  globalSetup: "<rootDir>/global-setup.ts",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
