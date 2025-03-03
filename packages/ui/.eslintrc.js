module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["unused-imports"],
  extends: ["@repo/eslint-config/next.js", "eslint:recommended"],
  ignorePatterns: ["**/language-management/form.tsx", "**/vendor/*.js"],
  rules: {
    /* Should stay disabled */
    camelcase: "off",
    "import/no-cycle": "off",
    "no-return-await": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-throw-literal": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
  },
};
