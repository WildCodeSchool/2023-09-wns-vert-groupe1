/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
};