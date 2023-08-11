module.exports = {
  apps: [
    {
      name: "a11yphant-api",
      script: "npm run dev:api",
      namespace: "a11yphant",
      autorestart: true,
    },
    {
      name: "a11yphant-site",
      script: "npm run dotenv -- npm run dev:site",
      namespace: "a11yphant",
      autorestart: true,
    },
  ],
};
