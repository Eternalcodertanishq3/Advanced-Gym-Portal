const nextJest = require("next/jest");

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Jest Test Configuration
// ═══════════════════════════════════════════════════════════════

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "**/tests/unit/**/*.test.ts",
    "**/tests/integration/**/*.test.ts",
    "**/tests/e2e/**/*.spec.ts"
  ],
};

module.exports = createJestConfig(customJestConfig);
