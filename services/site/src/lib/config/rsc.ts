export type ClientConfig = {
  graphqlEndpointClient: string;
  githubLoginEndpoint: string;
  twitterLoginEndpoint: string;
  isPlausibleEnabled?: boolean;
  baseUrl: string;
};

export const getClientConfig = (): ClientConfig => ({
  graphqlEndpointClient: process.env.SITE_GRAPHQL_ENDPOINT_CLIENT || throwMissingEnvVariable("SITE_GRAPHQL_ENDPOINT_CLIENT"),
  githubLoginEndpoint: process.env.SITE_GITHUB_LOGIN_ENDPOINT || throwMissingEnvVariable("SITE_GITHUB_LOGIN_ENDPOINT"),
  twitterLoginEndpoint: process.env.SITE_TWITTER_LOGIN_ENDPOINT || throwMissingEnvVariable("SITE_TWITTER_LOGIN_ENDPOINT"),
  isPlausibleEnabled: !!process.env.SITE_PLAUSIBLE_BASE_URL,
  baseUrl: process.env.SITE_BASE_URL || "http://localhost:3001",
});

export function getConfig(): {
  host: string;
  port: number;
  graphqlEndpointClient: string;
  graphqlEndpointServer: string;
  githubLoginEndpoint: string;
  twitterLoginEndpoint: string;
  plausibleBaseUrl?: string;
  baseUrl: string;
} {
  return {
    host: process.env.SITE_HOST || "localhost",
    port: Number(process.env.PORT) || 3001,
    graphqlEndpointServer: process.env.SITE_GRAPHQL_ENDPOINT_SERVER || throwMissingEnvVariable("SITE_GRAPHQL_ENDPOINT_CLIENT"),
    graphqlEndpointClient: process.env.SITE_GRAPHQL_ENDPOINT_CLIENT || throwMissingEnvVariable("SITE_GITHUB_LOGIN_ENDPOINT"),
    githubLoginEndpoint: process.env.SITE_GITHUB_LOGIN_ENDPOINT || throwMissingEnvVariable("SITE_TWITTER_LOGIN_ENDPOINT"),
    twitterLoginEndpoint: process.env.SITE_TWITTER_LOGIN_ENDPOINT || throwMissingEnvVariable("SITE_TWITTER_LOGIN_ENDPOINT"),
    plausibleBaseUrl: process.env.SITE_PLAUSIBLE_BASE_URL,
    baseUrl: process.env.SITE_BASE_URL || "http://localhost:3001",
  };
}

function throwMissingEnvVariable(name: string): never {
  throw new Error(`Missing environment variable ${name}`);
}
