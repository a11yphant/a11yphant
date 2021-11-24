/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require("@sentry/nextjs");

const allowedImageDomains = [];
const assetBaseUrl = process.env.SITE_ASSET_BASE_URL;

if (assetBaseUrl) {
  allowedImageDomains.push(new URL(assetBaseUrl).hostname);
}

const sentryWebpackPluginOptions = {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SITE_SENTRY_PROJECT,
  release: process.env.SITE_VERSION,
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.SENTRY_AUTH_TOKEN,
};

const config = {
  async rewrites() {
    return [
      {
        source: "/graphql",
        destination: process.env.SITE_GRAPHQL_ENDPOINT_SERVER,
      },
    ];
  },

  images: {
    domains: allowedImageDomains,
  },

  serverRuntimeConfig: {
    graphqlEndpointServer: process.env.SITE_GRAPHQL_ENDPOINT_SERVER,
  },

  publicRuntimeConfig: {
    graphqlEndpointClient: process.env.SITE_GRAPHQL_ENDPOINT_CLIENT,
    githubLoginEndpoint: process.env.SITE_GITHUB_LOGIN_ENDPOINT,
    twitterLoginEndpoint: process.env.SITE_TWITTER_LOGIN_ENDPOINT,
    assetBaseUrl: process.env.SITE_ASSET_BASE_URL,
    version: process.env.SITE_VERSION,
    sentryDsn: process.env.SITE_SENTRY_DSN,
    environment: process.env.SITE_ENVIRONMENT,
    splitbeeToken: process.env.SITE_SPLITBEE_TOKEN,
  },
};

module.exports = withSentryConfig(config, sentryWebpackPluginOptions);
