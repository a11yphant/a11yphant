/**
 * @jest-environment node
 */

import { JwtScope } from "app/api/authentication/enums/jwt-scope.enum";
import middleware from "app/middleware";
import crypto from "crypto";
import * as jose from "jose";
import { NextURL } from "next/dist/server/web/next-url";
import { NextRequest } from "next/server";

jest.mock("app/lib/apollo-client/create-apollo-client-rsc", () => ({
  createApolloClientRSC: jest.fn(),
}));

Object.defineProperty(global, "self", {
  value: {
    crypto: crypto.webcrypto,
  },
});

function getRequest(
  url: string,
  options: Partial<{
    cookies: Map<string, { name: string; value: string }>;
  }> = {},
): NextRequest {
  return {
    nextUrl: { clone: () => new NextURL(url) },
    headers: { get: () => "a11yphant.com" },
    cookies: options.cookies || new Map(),
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

  it("creates a new session if no cookie is present", async () => {
    const req = getRequest("http://a11yphant.com");
    const res = await middleware(req);

    expect(res).toBeDefined();
    expect(res.cookies.has("a11yphant_session")).toBeDefined();
  });

  it("the created session cookie has a sub set", async () => {
    const req = getRequest("http://a11yphant.com");
    const res = await middleware(req);

    const cookie = res.cookies.get("a11yphant_session");
    const payload = jose.decodeJwt(cookie.value);
    expect(payload.sub).toBeDefined();
  });

  it("the created session cookie is signed with the secret and has a11yphant as an issuer", async () => {
    const req = getRequest("http://a11yphant.com");
    const res = await middleware(req);

    const cookie = res.cookies.get("a11yphant_session");
    await expect(jose.jwtVerify(cookie.value, Buffer.from(process.env.API_KEY), { issuer: "a11yphant" })).resolves.toBeTruthy();
  });

  it("the created session cookie has the session scope set", async () => {
    const req = getRequest("http://a11yphant.com");
    const res = await middleware(req);

    const cookie = res.cookies.get("a11yphant_session");
    const payload = jose.decodeJwt(cookie.value);
    expect(payload.scope).toBe(JwtScope.SESSION);
  });

  it("extends the lifetime of the cookie if one is already present", async () => {
    const secret = process.env.API_KEY;
    const token = await new jose.SignJWT({ scope: JwtScope.SESSION })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuer("a11yphant")
      .setSubject("user-id")
      .setExpirationTime(`10 seconds from now`)
      .sign(Buffer.from(secret));

    const cookie = {
      name: "a11yphant_session",
      value: token,
    };

    const cookies = new Map();
    cookies.set(cookie.name, cookie);
    const req = getRequest("http://a11yphant.com", { cookies });
    const res = await middleware(req);

    const responseJwt = jose.decodeJwt(res.cookies.get("a11yphant_session").value);
    const requestJwt = jose.decodeJwt(token);
    expect(responseJwt.exp).not.toEqual(requestJwt.exp);
  });

  it("overwrites existing session cookies if they are invalid", async () => {
    const cookies = new Map();
    cookies.set("a11yphant_session", { name: "a11yphant_session", value: "invalid" });
    const req = getRequest("http://a11yphant.com", { cookies });

    const res = await middleware(req);

    const cookie = res.cookies.get("a11yphant_session");
    expect(cookie.value).not.toBe("invalid");
  });
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico,
     * - sitemap.xml,
     * - robots.txt (metadata files),
     * - fonts
     * - images
     * - videos
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|fonts/|images/|videos/).*)",
  ],
};
