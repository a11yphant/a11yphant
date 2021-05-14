module.exports = {
  testEnvironment: "jsdom",
  rootDir: "./",
  testRegex: ".*\\.spec\\.tsx$",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  moduleNameMapper: {
    "app/(.*)": "<rootDir>/src/$1",
  },
  reporters: ["default", "jest-junit"],
  collectCoverageFrom: ["<rootDir>/src/**/*.(t|j)s(x)"],
  coverageReporters: ["text", "text-summary", "cobertura"],
  coveragePathIgnorePatterns: ["<rootDir>/src/generated"],
  coverageDirectory: "<rootDir>",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
};
