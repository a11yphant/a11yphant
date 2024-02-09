const config = {
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
