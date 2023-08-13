module.exports = {
    "services/api/**/*.{ts,js,json}": "npm --prefix services/api run lint:eslint",
    "services/api/**/*.ts": () => ["npm --prefix services/api run lint:tsc", "npm --prefix services/api run generate-schema"],
    "services/site/**/*.{ts,tsx,js,jsx,json}": "npm --prefix services/site run lint:eslint",
    "services/site/**/*.{ts,tsx}": () => "npm --prefix services/site run lint:tsc",
    "challenges/*.yml": "npm run lint:content",
};
