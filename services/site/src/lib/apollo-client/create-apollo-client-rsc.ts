import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";

import { createForwardCookiesToServerLink, GetCookieHeaderFunction } from "./create-forward-cookies-to-server-link";

export function createApolloClientRSC(uri: string, getCookieHeader: GetCookieHeaderFunction = () => null): ApolloClient<NormalizedCacheObject> {
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: "no-store" },
  });

  const logResponse = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      console.log(response);
      return response;
    });
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([createForwardCookiesToServerLink(getCookieHeader), logResponse, httpLink]),
  });
}
