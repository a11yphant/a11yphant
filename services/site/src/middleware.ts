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
  const middlewares = [forwardGraphqlRequests, redirectChallengeOverlayUrls, authentication];

  for (const middleware of middlewares) {
    if (!middleware.match(req)) {
      continue;
    }

    return middleware.run(req);
  }
}

const forwardGraphqlRequests: Middleware = {
  match: (req) => process.env.SITE_GRAPHQL_ENDPOINT_SERVER && req.nextUrl.clone().pathname === "/graphql",
  run: async () => NextResponse.rewrite(process.env.SITE_GRAPHQL_ENDPOINT_SERVER),
};

const redirectChallengeOverlayUrls: Middleware = {
  match: (req) => req.nextUrl.clone().pathname === "/" && req.nextUrl.clone().searchParams.has("challenge"),
  run: async (req) => {
    const { baseUrl } = getConfig();
    return NextResponse.redirect(`${baseUrl}/challenges/${req.nextUrl.clone().searchParams.get("challenge")}`, { status: 308 });
  },
};

const authentication: Middleware = {
  match: (req) => !req.cookies.has("a11yphant_session"),
  run: async (req) => {
    const cookies: Cookie[] = [];

    const setCookie: SetCookieFunction = (cookie) => {
      cookies.push(cookie);
    };

    const getCookiesHeader: GetCookieHeaderFunction = () => {
      return req.headers.toString();
    };

    const client = createApolloClientRSC(getCookiesHeader);
    client.setLink(from([createForwardCookiesToClientLink(setCookie), client.link]));

    await client.query<CurrentUserQuery>({
      query: CurrentUserDocument,
    });

    for (const cookie of cookies) {
      req.cookies.set(cookie);
    }

    const response = NextResponse.next();

    for (const { name, value } of cookies) {
      response.cookies.set(name, value);
    }

    return response;
  },
};
