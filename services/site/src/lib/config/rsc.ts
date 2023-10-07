export type ClientConfig = {
  graphqlEndpointClient: string;
  githubLoginEndpoint: string;
  twitterLoginEndpoint: string;
  plausibleBaseUrl?: string;
};

export const getClientConfig = (): ClientConfig => ({
  graphqlEndpointClient: process.env.SITE_GRAPHQL_ENDPOINT_CLIENT,
  githubLoginEndpoint: process.env.SITE_GITHUB_LOGIN_ENDPOINT,
  twitterLoginEndpoint: process.env.SITE_TWITTER_LOGIN_ENDPOINT,
  plausibleBaseUrl: process.env.SITE_PLAUSIBLE_BASE_URL,
});

export function getConfig(): {
  host: string;
  port: number;
  graphqlEndpointClient: string;
  graphqlEndpointServer: string;
  githubLoginEndpoint: string;
  twitterLoginEndpoint: string;
  plausibleBaseUrl?: string;
} {
  return {
    host: process.env.SITE_HOST || "localhost",
    port: Number(process.env.PORT) || 3001,
    graphqlEndpointServer: process.env.SITE_GRAPHQL_ENDPOINT_SERVER,
    graphqlEndpointClient: process.env.SITE_GRAPHQL_ENDPOINT_CLIENT,
    githubLoginEndpoint: process.env.SITE_GITHUB_LOGIN_ENDPOINT,
    twitterLoginEndpoint: process.env.SITE_TWITTER_LOGIN_ENDPOINT,
    plausibleBaseUrl: process.env.SITE_PLAUSIBLE_BASE_URL,
  };
}
