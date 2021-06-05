import { ApolloLink } from "@apollo/client";
import { GetServerSidePropsContext } from "next";

export function createForwardCookiesToServerLink(context: GetServerSidePropsContext = null): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const cookie = context?.req?.headers?.cookie;

    operation.setContext({
      headers: cookie ? { cookie: cookie } : undefined,
    });

    return forward(operation);
  });
}
