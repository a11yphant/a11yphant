import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { createMockClient } from "@apollo/client/testing";
import { CurrentUserDocument, CurrentUserQuery, User } from "app/generated/graphql";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";

let mockClient: ApolloClient<NormalizedCacheObject>;
const mockUser: User = {
  id: "242003d6-402e-49b7-9ec2-702445b37c8e",
  displayName: "Mock User Name",
  isRegistered: true,
  isVerified: true,
};

beforeEach(() => {
  mockClient = createMockClient<CurrentUserQuery>(
    {
      currentUser: mockUser,
    },
    CurrentUserDocument,
  );
});

describe("getServerSideCurrentUser", () => {
  it("returns the current user", async () => {
    const { data } = await getServerSideCurrentUser(mockClient);
    expect(data.currentUser).toEqual(mockUser);
  });
});
