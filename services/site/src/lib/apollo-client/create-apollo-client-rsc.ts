import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";

import { GetCookieHeaderFunction } from "./create-forward-cookies-to-server-link";

export function createApolloClientRSC(uri: string, getCookieHeader: GetCookieHeaderFunction = () => null): ApolloClient<NormalizedCacheObject> {
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: "no-store" },
    credentials: "include",
    headers: {
      cookie: getCookieHeader(),
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}
