module.exports = {
  apps: [
    {
      name: "a11y-challenges-api",
      script: "dotenv -- npm run dev:api",
      autorestart: true,
    },
    {
      name: "a11y-challenges-site",
      script: "dotenv -- npm run dev:site",
      autorestart: true,
    },
  ],
};
