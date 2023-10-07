import React, { createContext, useContext } from "react";
export type { ClientConfig } from "./rsc";
export { getClientConfig } from "./rsc";
import { ClientConfig } from "./rsc";

const ConfigContext = createContext<ClientConfig>({
  graphqlEndpointClient: "/graphql",
  githubLoginEndpoint: "https://github.com",
  twitterLoginEndpoint: "https://twitter.com",
  isPlausibleEnabled: false,
  baseUrl: "http://localhost:3001",
});

export const ConfigProvider: React.FC<React.PropsWithChildren<{ value: ClientConfig }>> = ({ value, children }) => {
  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export function useClientConfig(): ClientConfig {
  return useContext(ConfigContext);
}
