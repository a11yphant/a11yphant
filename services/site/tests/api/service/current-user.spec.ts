/**
 * @jest-environment node
 */

import { createUserWithSessionCookie } from "@tests/support/authentication";
import { useDatabase, useTestingApp } from "@tests/support/helpers";
import gql from "graphql-tag";

describe("current user", () => {
  jest.setTimeout(15000);
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

    const { cookie, user } = await createUserWithSessionCookie(prisma, app);

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
