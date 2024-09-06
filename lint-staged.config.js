module.exports = {
    "services/site/**/*.{ts,tsx,js,jsx,json}": "npm --prefix services/site run lint:eslint",
    "services/site/**/*.{ts,tsx}": () => "npm --prefix services/site run lint:tsc",
    "challenges/*.yml": "npm run lint:content",
};
