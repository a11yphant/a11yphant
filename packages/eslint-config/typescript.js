module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["./base.js", "plugin:@typescript-eslint/eslint-recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint/eslint-plugin"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "error",
  },
};
