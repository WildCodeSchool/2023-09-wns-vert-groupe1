import type { Config } from "jest";
const nextJest = require("next/jest");

const createJestConfig = nextJest({
	dir: "./",
});

const config: Config = {
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	testPathIgnorePatterns: ["/tests-e2e/"],
};

module.exports = createJestConfig(config);
