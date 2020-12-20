module.exports = {
    "services/api/**/*.{ts,tsx,js,jsx,json}": "npm --prefix services/api run lint:eslint",
    "services/api/**/*.{ts,tsx}": () => "npm --prefix services/api run lint:tsc",
    "services/site/**/*.{ts,tsx,js,jsx,json}": "npm --prefix services/site run lint:eslint",
    "services/site/**/*.{ts,tsx}": () => "npm --prefix services/site run lint:tsc",
};
