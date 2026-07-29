export default {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "jsdom",
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: "tsconfig.test.json",
            useESM: true,
        }],
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
        "^.+\\.(css|sass|scss)$": "<rootDir>/__tests__/styleMock.ts",
        "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    setupFilesAfterEnv: ["<rootDir>/__tests__/setupTests.ts"],
    testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/frontend/" 
  ],
};