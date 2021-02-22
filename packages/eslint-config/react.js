module.exports = {
  extends: ["./typescript.js"],
  plugins: ["react", "react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/display-name": "off",
    "react/prop-types": "off",
  },
};
