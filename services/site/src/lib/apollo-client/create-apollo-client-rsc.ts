import { ApolloClient, from, HttpLink, NormalizedCacheObject } from "@apollo/client";
import { NextSSRApolloClient, NextSSRInMemoryCache } from "@apollo/experimental-nextjs-app-support/ssr";
import crossFetch from "cross-fetch";

import { getConfig } from "../config/rsc";
import { createForwardCookiesToServerLink, GetCookieHeaderFunction } from "./create-forward-cookies-to-server-link";

export function createApolloClientRSC(getCookieHeader: GetCookieHeaderFunction = () => null): ApolloClient<NormalizedCacheObject> {
  const { graphqlEndpointServer } = getConfig();
  const httpLink = new HttpLink({
    uri: graphqlEndpointServer,
    fetch: crossFetch,
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: from([createForwardCookiesToServerLink(getCookieHeader), httpLink]),
  });
}
