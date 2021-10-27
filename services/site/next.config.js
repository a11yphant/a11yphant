/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require("@sentry/nextjs");

const allowedImageDomains = [];
const assetBaseUrl = process.env.NEXT_PUBLIC_SITE_ASSET_BASE_URL;

if (assetBaseUrl) {
  allowedImageDomains.push(new URL(assetBaseUrl).hostname);
}

const sentryWebpackPluginOptions = {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SITE_SENTRY_PROJECT,
  release: process.env.NEXT_PUBLIC_SITE_VERSION,
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
};

const config = {
  target: "server",
  async rewrites() {
    if (!process.env.NEXT_PUBLIC_SITE_GRAPHQL_PROXY_TARGET) {
      return [];
    }

    return [
      {
        source: "/graphql",
        destination: process.env.NEXT_PUBLIC_SITE_GRAPHQL_PROXY_TARGET,
      },
    ];
  },

  images: {
    domains: allowedImageDomains,
  },
};

module.exports = withSentryConfig(config, sentryWebpackPluginOptions);
