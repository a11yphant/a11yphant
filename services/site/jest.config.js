module.exports = {
  testEnvironment: "jsdom",
  rootDir: "./",
  testRegex: ".*\\.spec\\.tsx?$",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleNameMapper: {
    "app/(.*)": "<rootDir>/src/$1",
    "tests/(.*)": "<rootDir>/tests/$1",
  },
  reporters: ["default", "jest-junit"],
  collectCoverageFrom: ["<rootDir>/src/**/*.(t|j)s?(x)"],
  coverageReporters: ["text", "text-summary", "lcov"],
  coveragePathIgnorePatterns: ["<rootDir>/src/generated", "<rootDir>/tests"],
  coverageDirectory: "<rootDir>/coverage",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
};
