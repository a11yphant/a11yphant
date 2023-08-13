import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();

  if (process.env.SITE_GRAPHQL_ENDPOINT_SERVER && url.pathname === "/graphql") {
    console.log(process.env.SITE_GRAPHQL_ENDPOINT_SERVER);
    return NextResponse.rewrite(process.env.SITE_GRAPHQL_ENDPOINT_SERVER);
  }
}
