const config = {
  serverRuntimeConfig: {
    graphqlEndpointServer: process.env.SITE_GRAPHQL_ENDPOINT_SERVER,
  },

  publicRuntimeConfig: {
    graphqlEndpointClient: process.env.SITE_GRAPHQL_ENDPOINT_CLIENT,
    githubLoginEndpoint: process.env.SITE_GITHUB_LOGIN_ENDPOINT,
    twitterLoginEndpoint: process.env.SITE_TWITTER_LOGIN_ENDPOINT,
    splitbeeToken: process.env.SITE_SPLITBEE_TOKEN,
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
};

module.exports = config;
