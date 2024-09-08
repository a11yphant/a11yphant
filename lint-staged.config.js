module.exports = {
  "**/*.{ts,tsx,js,jsx,json}": "npm run lint:eslint",
  "src/**/*.{ts,tsx}": () => "npm run lint:tsc",
  "challenges/*.yml": "npm run lint:content",
};
