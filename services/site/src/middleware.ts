import { from } from "@apollo/client";
import { CurrentUserDocument, CurrentUserQuery } from "app/generated/graphql";
import { createApolloClientRSC } from "app/lib/apollo-client/create-apollo-client-rsc";
import { Cookie, createForwardCookiesToClientLink } from "app/lib/apollo-client/create-forward-cookies-to-client-link";
import { SetCookieFunction } from "app/lib/apollo-client/create-forward-cookies-to-client-link";
import { GetCookieHeaderFunction } from "app/lib/apollo-client/create-forward-cookies-to-server-link";
import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "./lib/config/rsc";

export default async function middleware(req: NextRequest): Promise<NextResponse | void> {
  const url = req.nextUrl.clone();

  if (url.pathname === "/" && url.searchParams.has("challenge")) {
    const { host } = getConfig();
    return NextResponse.redirect(`https://${host}/challenge/${url.searchParams.get("challenge")}`, 308);
  }

  if (process.env.SITE_GRAPHQL_ENDPOINT_SERVER && url.pathname === "/graphql") {
    return NextResponse.rewrite(process.env.SITE_GRAPHQL_ENDPOINT_SERVER);
  }

  if (req.cookies.has("a11yphant_session")) {
    return;
  }

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
}
