/**
 * @jest-environment node
 */

import { ConfigService } from "@nestjs/config";
import { useDatabase } from "@tests/support/database";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { JwtScope } from "app/api/authentication/enums/jwt-scope.enum";
import { JwtService } from "app/api/authentication/jwt.service";
import { getServerSideCurrentUser } from "app/lib/get-server-side-current-user";
import { getService } from "app/lib/get-service";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

let cookies: ReadonlyRequestCookies;

jest.mock("next/headers", () => ({
  cookies: () => cookies,
}));

describe("getServerSideCurrentUser", () => {
  const { getPrismaService } = useDatabase();

  it("returns the current user", async () => {
    const prisma = getPrismaService();
    const user = UserFactory.build();
    await prisma.user.create({ data: user });

    const jwt = await getService<JwtService>(JwtService);
    const config = await getService<ConfigService>(ConfigService);
    const token = await jwt.createSignedToken({ scope: JwtScope.SESSION }, { subject: user.id, expiresInSeconds: 10 });

    const headers = new Headers();
    headers.append("Cookie", `${config.get("cookie.name")}=${token}`);
    cookies = new RequestCookies(headers) as unknown as ReadonlyRequestCookies;

    const fetchedUser = await getServerSideCurrentUser();
    expect(fetchedUser?.id).toEqual(user.id);
  });
});
