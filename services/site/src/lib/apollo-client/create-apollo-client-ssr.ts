import { from, HttpLink, NormalizedCacheObject } from "@apollo/client";
import { ApolloClient, InMemoryCache, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support";
import { ErrorDialogApi } from "app/components/common/error/useErrorDialog";
import { createErrorLink } from "app/lib/apollo-client/create-error-link";
import crossFetch from "cross-fetch";

import { createForwardCookiesToServerLink } from "./create-forward-cookies-to-server-link";

export function createApolloClientSSR(uri: string, ssrCookie: string, errorDialogApi: ErrorDialogApi): ApolloClient<NormalizedCacheObject> {
  const isServer = typeof window === "undefined";
  const httpLink = new HttpLink({
    uri,
    fetch: crossFetch,
    fetchOptions: { cache: "no-store" },
  });

  const links = [createErrorLink({ errorDialogApi }), httpLink];

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from(isServer ? [createForwardCookiesToServerLink(() => ssrCookie), new SSRMultipartLink({ stripDefer: true }), ...links] : links),
    credentials: "same-site",
  });
}
