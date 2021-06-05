module.exports = {
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
};
