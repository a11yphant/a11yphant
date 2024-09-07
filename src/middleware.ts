import { from } from "@apollo/client";
import { CurrentUserDocument, CurrentUserQuery } from "app/generated/graphql";
import { createApolloClientRSC } from "app/lib/apollo-client/create-apollo-client-rsc";
import { Cookie, createForwardCookiesToClientLink } from "app/lib/apollo-client/create-forward-cookies-to-client-link";
import { SetCookieFunction } from "app/lib/apollo-client/create-forward-cookies-to-client-link";
import { GetCookieHeaderFunction } from "app/lib/apollo-client/create-forward-cookies-to-server-link";
import { NextRequest, NextResponse } from "next/server";

import { getConfig } from "./lib/config/rsc";

type Middleware = {
  match: (req: NextRequest) => boolean;
  run: (req: NextRequest) => Promise<NextResponse | null>;
};

export default async function middleware(req: NextRequest): Promise<NextResponse | null> {
  const middlewares = [redirectChallengeOverlayUrls, redirectChallengeUrls, authentication];

  for (const middleware of middlewares) {
    if (!middleware.match(req)) {
      continue;
    }

    return middleware.run(req);
  }

  return NextResponse.next();
}

const redirectChallengeOverlayUrls: Middleware = {
  match: (req) => req.nextUrl.clone().pathname === "/" && req.nextUrl.clone().searchParams.has("challenge"),
  run: async (req) => {
    const { baseUrl } = getConfig(req.headers.get("host"));
    return NextResponse.redirect(`${baseUrl}challenges/${req.nextUrl.clone().searchParams.get("challenge")}`, {
      status: 308,
    });
  },
};

const redirectChallengeUrls: Middleware = {
  match: (req) => req.nextUrl.clone().pathname.startsWith("/challenge/"),
  run: async (req) => {
    const { baseUrl } = getConfig(req.headers.get("host"));
    return NextResponse.redirect(`${baseUrl}challenges/${req.nextUrl.clone().pathname.slice(11)}`, { status: 308 });
  },
};

const authentication: Middleware = {
  match: (req) => !req.cookies.has("a11yphant_session"),
  run: async (req) => {
    const { graphqlEndpointPath } = getConfig(req.headers.get("host"));
    const cookies: Cookie[] = [];

    const setCookie: SetCookieFunction = (cookie) => {
      cookies.push(cookie);
    };

    const getCookiesHeader: GetCookieHeaderFunction = () => {
      return req.headers.get("cookie");
    };

    const client = createApolloClientRSC(graphqlEndpointPath, getCookiesHeader);
    client.setLink(from([createForwardCookiesToClientLink(setCookie), client.link]));

    await client.query<CurrentUserQuery>({
      query: CurrentUserDocument,
    });

    for (const { name, value } of cookies) {
      req.cookies.set(name, value);
    }

    const response = NextResponse.next({
      request: {
        headers: new Headers(req.headers),
      },
    });

    for (const { name, value } of cookies) {
      response.cookies.set(name, value);
    }

    return response;
  },
};