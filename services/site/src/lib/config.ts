export function getConfig(): {
  host: string;
  port: number;
  graphqlEndpointClient: string;
  graphqlEndpointServer?: string;
  githubLoginEndpoint: string;
  twitterLoginEndpoint: string;
  plausibleBaseUrl?: string;
} {
  return {
    host: process.env.SITE_HOST || "localhost",
    port: Number(process.env.PORT) || 3001,
    graphqlEndpointServer: process.env.SITE_GRAPHQL_ENDPOINT_SERVER || missingConfigOption("SITE_GRAPHQL_ENDPOINT_SERVER"),
    graphqlEndpointClient: process.env.NEXT_PUBLIC_SITE_GRAPHQL_ENDPOINT_CLIENT || missingConfigOption("NEXT_PUBLIC_SITE_GRAPHQL_ENDPOINT_CLIENT"),
    githubLoginEndpoint: process.env.NEXT_PUBLIC_SITE_GITHUB_LOGIN_ENDPOINT || missingConfigOption("NEXT_PUBLIC_SITE_GITHUB_LOGIN_ENDPOINT"),
    twitterLoginEndpoint: process.env.NEXT_PUBLIC_SITE_TWITTER_LOGIN_ENDPOINT || missingConfigOption("NEXT_PUBLIC_SITE_TWITTER_LOGIN_ENDPOINT"),
  };
}

function missingConfigOption(envVariableName: string): string {
  if (!envVariableName.startsWith("NEXT_PUBLIC_")) {
    return "";
  }

  throw new Error(`Missing configuration for the ${envVariableName}`);
}
