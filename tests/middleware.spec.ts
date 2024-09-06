import { CurrentUserDocument } from "app/generated/graphql";
import { createApolloClientRSC } from "app/lib/apollo-client/create-apollo-client-rsc";
import middleware from "app/middleware";
import { NextURL } from "next/dist/server/web/next-url";
import { NextRequest } from "next/server";

import { createTerminatingLink } from "./lib/apollo-client/helpers";

jest.mock("app/lib/apollo-client/create-apollo-client-rsc", () => ({
  createApolloClientRSC: jest.fn(),
}));

function getRequest(url: string): NextRequest {
  return {
    nextUrl: { clone: () => new NextURL(url) },
    headers: { get: () => "a11yphant.com" },
  } as unknown as NextRequest;
}

describe("middleware", () => {
  it("redirects old challenge modal urls", async () => {
    const req = getRequest("http://a11yphant.com/?challenge=headings");
    const res = await middleware(req);
    expect(res).toBeDefined();
    expect(res?.status).toEqual(308);
    expect(res?.headers.get("location")).toEqual("http://a11yphant.com/challenges/headings");
  });

  it("redirects old level urls", async () => {
    const req = getRequest("http://a11yphant.com/challenge/headings/level/1");
    const res = await middleware(req);
    expect(res).toBeDefined();
    expect(res?.status).toEqual(308);
    expect(res?.headers.get("location")).toEqual("http://a11yphant.com/challenges/headings/level/1");
  });

  it("creates a user if no user cookie is set", async () => {
    const client = { query: jest.fn(), link: createTerminatingLink(), setLink: jest.fn() };
    (createApolloClientRSC as jest.Mock).mockReturnValue(client);
    const req = {
      nextUrl: { clone: () => new NextURL("http://a11yphant.com/page") },
      cookies: { has: () => false },
      headers: { toString: () => "", get: () => "a11yphant.com" },
    } as unknown as NextRequest;

    await middleware(req);

    expect(client.query).toHaveBeenCalledWith(expect.objectContaining({ query: CurrentUserDocument }));
  });
});
