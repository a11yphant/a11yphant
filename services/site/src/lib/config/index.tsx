import React, { createContext, useContext } from "react";

export type ClientConfig = {
  graphqlEndpointClient: string;
  githubLoginEndpoint: string;
  twitterLoginEndpoint: string;
  isPlausibleEnabled?: string;
};

export const getClientConfig = (): ClientConfig => ({
  domain: process.env.SITE_HOST,
  graphqlEndpointClient: process.env.SITE_GRAPHQL_ENDPOINT_CLIENT,
  githubLoginEndpoint: process.env.SITE_GITHUB_LOGIN_ENDPOINT,
  twitterLoginEndpoint: process.env.SITE_TWITTER_LOGIN_ENDPOINT,
  isPlausibleEnabled: !!process.env.SITE_PLAUSIBLE_BASE_URL,
});

const ConfigContext = createContext<ClientConfig>({
  graphqlEndpointClient: "/graphql",
  githubLoginEndpoint: "https://github.com",
  twitterLoginEndpoint: "https://twitter.com",
});

export const ConfigProvider: React.FC<React.PropsWithChildren<{ value: ClientConfig }>> = ({ value, children }) => {
  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export function useClientConfig(): ClientConfig {
  return useContext(ConfigContext);
}
