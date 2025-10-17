/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  testMatch: ["**/tests/**/*.test.ts?(x)"],
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.ts",
    "<rootDir>/tests/setupEnv.ts"
  ],
  moduleDirectories: ["node_modules", "src"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],
  extensionsToTreatAsEsm: [".ts", ".tsx"], // 🔥 NEW
  transformIgnorePatterns: ["/node_modules/(?!(@supabase|whatwg-fetch))"], // optional
};
