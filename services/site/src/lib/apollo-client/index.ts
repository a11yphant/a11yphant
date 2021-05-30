import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import crossFetch from "cross-fetch";
import { GetServerSidePropsContext } from "next";
import { useMemo } from "react";

import { createForwardCookiesToClientLink } from "./create-forward-cookies-to-client-link";
import { createForwardCookiesToServerLink } from "./create-forward-cookies-to-server-link";

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createApolloClient(context: GetServerSidePropsContext = null): ApolloClient<NormalizedCacheObject> {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_SITE_GRAPHQL_ENDPOINT,
    fetch: crossFetch,
  });

  // the http link has to be at the end because it is a terminating link
  const link = createForwardCookiesToClientLink(context).concat(createForwardCookiesToServerLink(context)).concat(httpLink);

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link,
    cache: new InMemoryCache(),
    credentials: "same-site",
  });
}

export function initializeApollo(
  initialState: NormalizedCacheObject = null,
  context: GetServerSidePropsContext = null,
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient(context);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject): ApolloClient<NormalizedCacheObject> {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
