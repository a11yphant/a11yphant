import { useDatabase, useTestingApp } from "@tests/support/helpers";
import gql from "graphql-tag";

describe("current user", () => {
  useDatabase();
  const { getGraphQlClient } = useTestingApp();

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
});
