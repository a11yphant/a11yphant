export type ClientConfig = {
  isDevelopmentMode: boolean;
  graphqlEndpointClient: string;
  githubLoginEndpoint: string;
  twitterLoginEndpoint: string;
  isPlausibleEnabled?: boolean;
  baseUrl: string;
};

export const getClientConfig = (): ClientConfig => ({
  isDevelopmentMode: process.env.NODE_ENV === "development",
  graphqlEndpointClient: process.env.SITE_GRAPHQL_ENDPOINT_CLIENT || warnMissingEnvVariable("SITE_GRAPHQL_ENDPOINT_CLIENT"),
  githubLoginEndpoint: process.env.SITE_GITHUB_LOGIN_ENDPOINT || warnMissingEnvVariable("SITE_GITHUB_LOGIN_ENDPOINT"),
  twitterLoginEndpoint: process.env.SITE_TWITTER_LOGIN_ENDPOINT || warnMissingEnvVariable("SITE_TWITTER_LOGIN_ENDPOINT"),
  isPlausibleEnabled: !!process.env.SITE_PLAUSIBLE_BASE_URL,
  baseUrl: process.env.SITE_BASE_URL || "http://localhost:3001",
});

export function getConfig(): {
  isDevelopmentMode: boolean;
  host: string;
  port: number;
  graphqlEndpointClient: string;
  githubLoginEndpoint: string;
  twitterLoginEndpoint: string;
  plausibleBaseUrl?: string;
  getBaseUrl: (host: string) => string;
  getGraphqlEndpointUrl: (host: string) => string;
} {
  return {
    isDevelopmentMode: process.env.NODE_ENV === "development",
    host: process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.SITE_HOST || "localhost",
    port: Number(process.env.PORT) || 3001,
    graphqlEndpointClient: process.env.SITE_GRAPHQL_ENDPOINT_CLIENT || warnMissingEnvVariable("SITE_GRAPHQL_ENDPOINT_CLIENT"),
    githubLoginEndpoint: process.env.SITE_GITHUB_LOGIN_ENDPOINT || warnMissingEnvVariable("SITE_TWITTER_LOGIN_ENDPOINT"),
    twitterLoginEndpoint: process.env.SITE_TWITTER_LOGIN_ENDPOINT || warnMissingEnvVariable("SITE_TWITTER_LOGIN_ENDPOINT"),
    plausibleBaseUrl: process.env.SITE_PLAUSIBLE_BASE_URL,
    getBaseUrl,
    getGraphqlEndpointUrl,
  };
}

function getBaseUrl(host: string): string {
  return getUrl("/", host);
}

function getGraphqlEndpointUrl(host: string): string {
  return getUrl("/api/graphql", host);
}

function getUrl(path: string, host: string): string {
  const url = new URL(path, `${process.env.SITE_PROTOCOL || "http"}://${host}`);

  return url.toString();
}

function warnMissingEnvVariable(name: string): string {
  console.error(`Missing environment variable ${name}`);
  return "";
}
