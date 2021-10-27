const allowedImageDomains = [];
const assetBaseUrl = process.env.NEXT_PUBLIC_SITE_ASSET_BASE_URL;

if (assetBaseUrl) {
  allowedImageDomains.push(new URL(assetBaseUrl).hostname);
}

module.exports = {
  async rewrites() {
    const rewrites = [
      {
        source: "/bee.js",
        destination: "https://cdn.splitbee.io/sb.js",
      },
      {
        source: "/_hive/:slug",
        destination: "https://hive.splitbee.io/:slug",
      },
    ];

    if (!process.env.NEXT_PUBLIC_SITE_GRAPHQL_PROXY_TARGET) {
      return rewrites;
    }

    return [
      {
        source: "/graphql",
        destination: process.env.NEXT_PUBLIC_SITE_GRAPHQL_PROXY_TARGET,
      },
      ...rewrites,
    ];
  },

  images: {
    domains: allowedImageDomains,
  },
};
