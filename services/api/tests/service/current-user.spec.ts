import { Factory, USER, UserData } from "@tests/support/factories/database";
import { useDatabase, useTestingApp } from "@tests/support/helpers";
import gql from "graphql-tag";

import { SessionToken } from "@/authentication/interfaces/session-token.interface";
import { JwtService } from "@/authentication/jwt.service";

describe("current user", () => {
  const { getPrismaService } = useDatabase();
  const { getGraphQlClient, getApp } = useTestingApp();

  it("returns an anonymous user if the user is not registered", async () => {
    const { data } = await getGraphQlClient().query({
      query: gql`
        query currentUser {
          currentUser {
            id
            isRegistered
          }
        }
      `,
    });

    expect(data.currentUser.id).toBeTruthy();
    expect(data.currentUser.isRegistered).toBeFalsy();
  });

  it("returns a registered user if a user is logged in", async () => {
    const app = getApp();
    const prisma = getPrismaService();

    const user = await prisma.user.create({ data: Factory.build<UserData>(USER, { authProvider: "github", displayName: "Test User" }) });
    const jwtService = app.get<JwtService>(JwtService);
    const sessionToken: SessionToken = {
      userId: user.id,
    };
    const cookie = await jwtService.createSignedToken(sessionToken, { subject: "session", expiresInSeconds: 3600 });

    const graphqlClient = getGraphQlClient({ authCookie: cookie });
    const { data } = await graphqlClient.query({
      query: gql`
        query currentUser {
          currentUser {
            id
            displayName
            isRegistered
          }
        }
      `,
    });

    expect(data.currentUser.id).toEqual(user.id);
    expect(data.currentUser.displayName).toEqual(user.displayName);
    expect(data.currentUser.isRegistered).toBeTruthy();
  });
});
