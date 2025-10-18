/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
  },

  extensionsToTreatAsEsm: [".ts", ".tsx"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^src/(.*)$": "<rootDir>/src/$1",
  },

  setupFiles: ["<rootDir>/tests/shims/importMetaEnv.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],

  moduleDirectories: ["node_modules", "src"],

  testMatch: [
    "**/tests/**/*.test.ts?(x)",
    "**/__tests__/**/*.test.ts?(x)",
  ],

  transformIgnorePatterns: [
    "node_modules/(?!(@supabase|@testing-library)/)"
  ],

  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
      useESM: true
    },
  },
};
