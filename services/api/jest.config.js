module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./",
  modulePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.ts$": "@swc/jest",
  },
  collectCoverageFrom: ["<rootDir>/src/**/*.(t|j)s"],
  testEnvironment: "node",
  reporters: ["default", "jest-junit"],
  coverageReporters: ["text", "text-summary", "lcov"],
  globalSetup: "<rootDir>/tests/setup.ts",
  coverageDirectory: "<rootDir>/coverage",
  moduleNameMapper: {
    "@tests/(.*)$": "<rootDir>/tests/$1",
    "@/(.*)$": "<rootDir>/src/$1",
  },
  runtime: "@side/jest-runtime",
};
