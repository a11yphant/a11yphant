import { from, HttpLink, NormalizedCacheObject } from "@apollo/client";
import { ApolloClient, InMemoryCache, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support";
import { ErrorDialogApi } from "app/components/common/error/useErrorDialog";
import { createErrorLink } from "app/lib/apollo-client/create-error-link";

export function createApolloClient(uri: string, ssrCookie: string, errorDialogApi: ErrorDialogApi): ApolloClient<NormalizedCacheObject> {
  const isServer = typeof window === "undefined";
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: "no-store" },
    credentials: "same-origin",
    headers: isServer
      ? {
          cookie: ssrCookie,
        }
      : undefined,
  });

  const links = [createErrorLink({ errorDialogApi }), httpLink];

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from(isServer ? [new SSRMultipartLink({ stripDefer: true }), ...links] : links),
  });
}
