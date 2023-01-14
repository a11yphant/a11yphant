const config = {
  serverRuntimeConfig: {
    graphqlEndpointServer: process.env.SITE_GRAPHQL_ENDPOINT_SERVER,
  },

  publicRuntimeConfig: {
    graphqlEndpointClient: process.env.SITE_GRAPHQL_ENDPOINT_CLIENT,
    githubLoginEndpoint: process.env.SITE_GITHUB_LOGIN_ENDPOINT,
    twitterLoginEndpoint: process.env.SITE_TWITTER_LOGIN_ENDPOINT,
    isPlausibleEnabled: !!process.env.SITE_PLAUSIBLE_BASE_URL,
    domain: process.env.SITE_HOST,
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
