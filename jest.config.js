export default  {
    verbose: true,
    setupFilesAfterEnv: [
        "./src/setupTests.js"
    ],
    moduleNameMapper: {
        "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
        "holderjs(.*)": "<rootDir>/__mocks__/holderjs.js",
        "react-markdown": "<rootDir>/__mocks__/react-markdown.js",
        "rehype-raw": "<rootDir>/__mocks__/rehype-raw.js"
    },
    extensionsToTreatAsEsm: [".jsx"],
    transformIgnorePatterns: ["/node_modules/"]
};