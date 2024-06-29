import { ApolloLink } from "@apollo/client";
import setCookieParser from "set-cookie-parser";

export type Cookie = {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  expires?: Date;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
};

export type SetCookieFunction = (cookie: Cookie) => void;

export function createForwardCookiesToClientLink(setCookie: SetCookieFunction | null = () => null): ApolloLink {
  return new ApolloLink((operation, forward) => {
    if (!setCookie) {
      return forward(operation);
    }

    return forward(operation).map((response) => {
      const apolloContext = operation.getContext();
      const setCookieHeader = apolloContext.response.headers.get("Set-Cookie");
      const cookies: Cookie[] = setCookieParser.parse(setCookieHeader);

      if (setCookie) {
        cookies.forEach((cookie) => setCookie(cookie));
      }

      return response;
    });
  });
}
