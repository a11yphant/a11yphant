/**
 * @jest-environment node
 */

import { ConfigService } from "@nestjs/config";
import { useDatabase } from "@tests/support/database";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { JwtScope } from "app/api/authentication/enums/jwt-scope.enum";
import { JwtService } from "app/api/authentication/jwt.service";
import { useServerSideCurrentUser } from "app/hooks/useServerSideCurrentUser";
import { useService } from "app/hooks/useService";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

let cookies: ReadonlyRequestCookies;

jest.mock("next/headers", () => ({
  cookies: () => cookies,
}));

describe("useServerSideCurrentUser", () => {
  const { getPrismaService } = useDatabase();

  it("returns the current user", async () => {
    const prisma = getPrismaService();
    const user = UserFactory.build();
    await prisma.user.create({ data: user });

    const jwt = await useService<JwtService>(JwtService);
    const config = await useService<ConfigService>(ConfigService);
    const token = await jwt.createSignedToken({ scope: JwtScope.SESSION }, { subject: user.id, expiresInSeconds: 10 });

    const headers = new Headers();
    headers.append("Cookie", `${config.get("cookie.name")}=${token}`);
    cookies = new RequestCookies(headers) as unknown as ReadonlyRequestCookies;

    const fetchedUser = await useServerSideCurrentUser();
    expect(fetchedUser?.id).toEqual(user.id);
  });
});
