import { ApolloClient, from, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { ErrorDialogApi, useErrorDialogApi } from "app/components/common/error/useErrorDialog";
import { createErrorLink } from "app/lib/apollo-client/create-error-link";
import crossFetch from "cross-fetch";
import { GetServerSidePropsContext } from "next";
import getConfig from "next/config";
import { useMemo } from "react";

import { createForwardCookiesToClientLink } from "./create-forward-cookies-to-client-link";
import { createForwardCookiesToServerLink } from "./create-forward-cookies-to-server-link";

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createApolloClient(context: GetServerSidePropsContext = null, errorDialogApi: ErrorDialogApi): ApolloClient<NormalizedCacheObject> {
  const isServer = typeof window === "undefined";
  const httpLink = new HttpLink({
    uri: isServer ? serverRuntimeConfig.graphqlEndpointServer : publicRuntimeConfig.graphqlEndpointClient,
    fetch: crossFetch,
  });

  return new ApolloClient({
    ssrMode: isServer,
    // the http link has to be at the end because it is a terminating link
    link: from([createForwardCookiesToClientLink(context), createForwardCookiesToServerLink(context), createErrorLink({ errorDialogApi }), httpLink]),
    cache: new InMemoryCache(),
    credentials: "same-site",
  });
}

export function initializeApollo(
  initialState: NormalizedCacheObject = null,
  context: GetServerSidePropsContext = null,
  errorDialogApi?: ErrorDialogApi,
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient(context, errorDialogApi);

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

export function useApollo(initialState: NormalizedCacheObject, customErrorDialogApi?: ErrorDialogApi): ApolloClient<NormalizedCacheObject> {
  const internalErrorDialogApi = useErrorDialogApi();
  const errorDialogApi = customErrorDialogApi ?? internalErrorDialogApi;

  const store = useMemo(() => initializeApollo(initialState, null, errorDialogApi), [errorDialogApi, initialState]);
  return store;
}
