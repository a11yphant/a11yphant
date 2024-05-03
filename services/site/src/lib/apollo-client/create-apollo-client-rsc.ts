import { ApolloClient, from, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import crossFetch from "cross-fetch";

import { getConfig } from "../config/rsc";
import { createForwardCookiesToServerLink, GetCookieHeaderFunction } from "./create-forward-cookies-to-server-link";

export function createApolloClientRSC(getCookieHeader: GetCookieHeaderFunction = () => null): ApolloClient<NormalizedCacheObject> {
  const { graphqlEndpointServer } = getConfig();
  const httpLink = new HttpLink({
    uri: graphqlEndpointServer,
    fetch: crossFetch,
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([createForwardCookiesToServerLink(getCookieHeader), httpLink]),
  });
}
