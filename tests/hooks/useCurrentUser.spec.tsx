import { MockedProvider } from "@apollo/client/testing";
import { act, renderHook } from "@testing-library/react";
import { CurrentUserDocument, User } from "app/generated/graphql";
import { useCurrentUser } from "app/hooks/useCurrentUser";
import React from "react";

const mockUser: User = {
  id: "242003d6-402e-49b7-9ec2-702445b37c8e",
  displayName: "Mock User Name",
  isRegistered: true,
  isVerified: true,
};

const mocks = [
  {
    request: {
      query: CurrentUserDocument,
    },
    result: {
      data: {
        currentUser: mockUser,
      },
    },
  },
];

describe("useCurrentUser", () => {
  it("returns the current user", async () => {
    const wrapper = ({ children }): React.ReactElement => <MockedProvider mocks={mocks}>{children}</MockedProvider>;
    const { result } = renderHook(() => useCurrentUser(), { wrapper });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.currentUser).toEqual(mockUser);
  });
});
