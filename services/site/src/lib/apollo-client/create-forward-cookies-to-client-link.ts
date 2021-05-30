import { ApolloLink } from "@apollo/client";
import { GetServerSidePropsContext } from "next";

export function createForwardCookiesToClientLink(context: GetServerSidePropsContext = null): ApolloLink {
  return new ApolloLink((operation, forward) => {
    if (!context) {
      return forward(operation);
    }

    return forward(operation).map((response) => {
      const apolloContext = operation.getContext();
      const setCookieHeader = apolloContext.response.headers.get("Set-Cookie");

      if (setCookieHeader) {
        context.res.setHeader("Set-Cookie", setCookieHeader);
      }

      return response;
    });
  });
}
