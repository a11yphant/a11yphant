import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

import { JwtScope } from "./api/authentication/enums/jwt-scope.enum";
import { JwtOptions } from "./api/authentication/interfaces/jwt-options.interface";
import { SessionToken } from "./api/authentication/interfaces/session-token.interface";
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
  match: (_) => true,
  run: async (req) => {
    if (req.cookies.has("a11yphant_session") && (await validateToken(req.cookies.get("a11yphant_session").value, JwtScope.SESSION))) {
      const { sub: userId } = decodeToken(req.cookies.get("a11yphant_session").value);
      const tokenData: SessionToken = {
        userId,
      };

      const token = await createSignedToken({ scope: JwtScope.SESSION }, { subject: tokenData.userId, expiresInSeconds: 3600 * 24 * 365 });

      const response = NextResponse.next();

      response.cookies.set({
        name: "a11yphant_session",
        value: token,
        sameSite: "lax",
        secure: true,
        httpOnly: true,
      });

      return response;
    }

    const tokenData: SessionToken = {
      userId: self.crypto.randomUUID(),
    };

    const token = await createSignedToken({ scope: JwtScope.SESSION }, { subject: tokenData.userId, expiresInSeconds: 3600 * 24 * 365 });

    const response = NextResponse.next();

    response.cookies.set({
      name: "a11yphant_session",
      value: token,
      sameSite: "lax",
      secure: process.env.SITE_PROTOCOL === "https" ? true : false,
      httpOnly: true,
    });

    return response;
  },
};

async function createSignedToken(content: Record<string, any>, options: JwtOptions): Promise<string> {
  const secret = process.env.API_KEY;
  const token = await new jose.SignJWT(content)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuer("a11yphant")
    .setSubject(options.subject)
    .setExpirationTime(`${options.expiresInSeconds} seconds from now`)
    .sign(Buffer.from(secret));

  return token;
}

async function validateToken(token: string, scope: JwtScope): Promise<boolean> {
  const secret = process.env.API_KEY;
  try {
    const { payload } = await jose.jwtVerify<{ scope: JwtScope }>(token, Buffer.from(secret), {
      issuer: "a11yphant",
    });

    return scope === payload.scope;
  } catch (e) {
    return false;
  }
}

function decodeToken<T extends Record<string, any>>(token: string): T {
  return jose.decodeJwt<T>(token);
}
