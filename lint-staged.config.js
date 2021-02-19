module.exports = {
    "services/api/**/*.{ts,tsx,js,jsx,json}": "npm --prefix services/api run lint:eslint",
    "services/api/**/*.{ts,tsx}": () => "npm --prefix services/api run lint:tsc",
    "services/site/**/*.{ts,tsx,js,jsx,json}": "npm --prefix services/site run lint:eslint",
    "services/site/**/*.{ts,tsx}": () => "npm --prefix services/site run lint:tsc",
    "services/submission-checker/**/*.{ts,js}": "npm --prefix services/submission-checker run lint:eslint",
    "services/submission-checker/**/*.{ts,tsx}": () => "npm --prefix services/submission-checker run lint:tsc",
    "services/database-migration/**/*.{js}": "npm --prefix services/database-migration run lint",
    "services/import-challenges/**/*.{ts,js,json}": "npm --prefix services/import-challenges run lint:eslint",
    "services/import-challenges/**/*.{ts,tsx}": () => "npm --prefix services/import-challenges run lint:tsc",
};
