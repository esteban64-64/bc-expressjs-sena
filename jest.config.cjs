/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  testTimeout: 30000,
  clearMocks: true,
  setupFiles: ["<rootDir>/jest.setup.cjs"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/servidor.ts",
    "!src/semilla.ts",
    "!src/types/**",
    "!src/**/*.d.ts",
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};
