"use strict";

module.exports = [
  { ignores: ["node_modules/", "dist/", "*.min.js"] },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "writable",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    rules: {
      "strict": ["error", "global"],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": "warn",
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "no-implicit-globals": "error",
      "block-scoped-var": "error",
      "no-throw-literal": "error",
      "no-return-await": "error",
      "require-await": "warn",
      "no-duplicate-imports": "error",
      "no-shadow": ["warn", { builtinGlobals: true, hoist: "all" }],
    },
  },
  {
    files: ["build.js", "server.js"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["test/**/*.js"],
    rules: {
      "no-implicit-globals": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
];
