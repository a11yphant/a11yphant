// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverMinification: false,
    serverComponentsExternalPackages: [
      "@apollo/server",
      "@nestjs/core",
      "fsevents",
      "@nestjs-modules/mailer",
      "@nestjs/apollo",
      "@nestjs/common",
      "@nestjs/config",
      "@nestjs/graphql",
      "@nestjs/passport",
      "@nestjs/platform-express",
      "handlebars",
    ],
  },

  webpack(config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src/api");

    // Important: return the modified config
    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)?",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },

  async rewrites() {
    const plausibleBaseUrl = process.env.SITE_PLAUSIBLE_BASE_URL;
    return plausibleBaseUrl
      ? [
          {
            source: "/js/script.js",
            destination: `${process.env.SITE_PLAUSIBLE_BASE_URL}/js/script.js`,
          },
          {
            source: "/api/event",
            destination: `${process.env.SITE_PLAUSIBLE_BASE_URL}/api/event`,
          },
        ]
      : [];
  },
};

module.exports = config;
