module.exports = {
  apps: [
    {
      name: "a11y-challenges-api",
      script: "npm run dotenv -- npm run dev:api",
      autorestart: true,
    },
    {
      name: "a11y-challenges-site",
      script: "npm run dotenv -- npm run dev:site",
      autorestart: true,
    },
  ],
};
