import { ApolloLink } from "@apollo/client";

export type GetCookieHeaderFunction = () => string | null;

export function createForwardCookiesToServerLink(getCookieHeader: GetCookieHeaderFunction = () => null): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const cookie = getCookieHeader();

    operation.setContext({
      headers: cookie ? { cookie: cookie } : undefined,
    });

    return forward(operation);
  });
}
