import { ApolloClient, from, HttpLink, NormalizedCacheObject } from "@apollo/client";
import { NextSSRApolloClient, NextSSRInMemoryCache } from "@apollo/experimental-nextjs-app-support/ssr";

import { getConfig } from "../config";
import { createForwardCookiesToServerLink, GetCookieHeaderFunction } from "./create-forward-cookies-to-server-link";

export function createApolloClientRSC(getCookieHeader: GetCookieHeaderFunction = () => null): ApolloClient<NormalizedCacheObject> {
  const httpLink = new HttpLink({
    uri: getConfig().graphqlEndpointServer,
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: from([createForwardCookiesToServerLink(getCookieHeader), httpLink]),
  });
}
