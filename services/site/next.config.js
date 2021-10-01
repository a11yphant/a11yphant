const allowedImageDomains = [];
const assetBaseUrl = process.env.NEXT_PUBLIC_SITE_ASSET_BASE_URL;

if (assetBaseUrl) {
  allowedImageDomains.push(new URL(assetBaseUrl).hostname);
}

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

  images: {
    domains: allowedImageDomains,
  },
};
