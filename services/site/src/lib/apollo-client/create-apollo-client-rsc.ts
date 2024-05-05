import { ApolloClient, from, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import crossFetch from "cross-fetch";

import { createForwardCookiesToServerLink, GetCookieHeaderFunction } from "./create-forward-cookies-to-server-link";

export function createApolloClientRSC(uri: string, getCookieHeader: GetCookieHeaderFunction = () => null): ApolloClient<NormalizedCacheObject> {
  const httpLink = new HttpLink({
    uri,
    fetch: crossFetch,
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([createForwardCookiesToServerLink(getCookieHeader), httpLink]),
  });
}
