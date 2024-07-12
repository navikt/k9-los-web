export default {
  projects: [
    {
      displayName: "test",
      cacheDirectory: "<rootDir>/jest_cache/",
      moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx", "less", "css"],
      moduleNameMapper: {
        "\\.(svg)$": "<rootDir>/setup/fileMock.js",
        "\\.(less|css)$": "identity-obj-proxy",
      },
      roots: ["<rootDir>/src"],
      setupFiles: ["<rootDir>/setup/setup.js"],
      setupFilesAfterEnv: ["<rootDir>/setup/setup-test-env.ts"],
      testEnvironment: "jsdom",
      testMatch: ["**/?(*.)+(spec).+(js|jsx|ts|tsx)"],
      testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "<rootDir>/src/client/tests/",
      ],
      transform: {
        "^.+\\.(ts|tsx|js|jsx)?$": "babel-jest",
        "^.+.(css|less)$": "jest-transform-stub",
      },
      transformIgnorePatterns: ["<rootDir>.*(node_modules)(?!.*(nav).*).*$"],
      // ignore tests in tests folder
      moduleDirectories: ["node_modules", "src/client", "src/client/app"],
    },
  ],
};
