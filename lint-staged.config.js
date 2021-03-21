module.exports = {
    "services/api/**/*.{ts,js,json}": "npm --prefix services/api run lint:eslint",
    "services/api/**/*.{ts}": () => "npm --prefix services/api run lint:tsc",
    "services/site/**/*.{ts,tsx,js,jsx,json}": "npm --prefix services/site run lint:eslint",
    "services/site/**/*.{ts,tsx}": () => "npm --prefix services/site run lint:tsc",
    "services/submission-checker/**/*.{ts,js}": "npm --prefix services/submission-checker run lint:eslint",
    "services/submission-checker/**/*.{ts}": () => "npm --prefix services/submission-checker run lint:tsc",
    "services/submission-renderer/**/*.{ts,js}": "npm --prefix services/submission-renderer run lint:eslint",
    "services/submission-renderer/**/*.{ts}": () => "npm --prefix services/submission-renderer run lint:tsc",
    "services/database-migration/**/*.{js}": "npm --prefix services/database-migration run lint",
    "services/import-challenges/**/*.{ts,js,json}": "npm --prefix services/import-challenges run lint:eslint",
    "services/import-challenges/**/*.{ts,tsx}": () => "npm --prefix services/import-challenges run lint:tsc",
    "packages/nestjs-aws-messaging-transport-strategy/**": "npm --prefix packages/nestjs-aws-messaging-transport-strategy run lint",
};
