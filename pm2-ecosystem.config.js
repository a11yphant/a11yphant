module.exports = {
  apps: [
    {
      name: "a11y-challenges-api",
      script: "npm run dotenv -- npm run dev:api",
      namespace: "a11y-challenges",
      autorestart: true,
    },
    {
      name: "a11y-challenges-site",
      script: "npm run dotenv -- npm run dev:site",
      namespace: "a11y-challenges",
      autorestart: true,
    },
    {
      name: "a11y-challenges-submission-checker",
      script: "npm run dotenv -- npm run dev:submission-checker",
      namespace: "a11y-challenges",
      autorestart: true,
    },
  ],
};
