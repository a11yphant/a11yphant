import { cleanup, render } from "@testing-library/react";
import UserProfile from "app/pages/profile/[userId]";
import React from "react";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    query: {
      userId: "7540d925-e08b-4dec-b537-d9b4f3818a1e",
    },
  })),
}));

jest.mock("app/generated/graphql", () => ({
  useUserByIdQuery: jest.fn().mockReturnValue({
    data: {
      user: {
        id: "0f00f41d-d782-4bba-9aac-fd5a929ab318",
        displayName: "Hans Schröder",
      },
    },
  }),
  useChallengesWithStatusForUserQuery: jest.fn().mockReturnValue({
    data: {
      challenges: [
        {
          id: "798cef99-c20f-4ffe-abac-2e4c507a2d8e",
          name: "Dummy Challenge",
          statusForUser: "FINISHED",
        },
      ],
    },
  }),
}));

jest.mock("app/components/navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

afterEach(cleanup);

describe("user profile page", () => {
  it("can render", () => {
    const { container } = render(<UserProfile />);

    expect(container.firstChild).toBeTruthy();
  });

  it("shows the name of the user", () => {
    const { findByText } = render(<UserProfile />);

    expect(findByText("Hans Schröder")).toBeTruthy();
  });

  it("shows the name of the user", () => {
    const { findByText } = render(<UserProfile />);

    expect(findByText("Hans Schröder")).toBeTruthy();
  });

  it("shows the name of the challenge", () => {
    const { findByText } = render(<UserProfile />);

    expect(findByText("Dummy Challenge")).toBeTruthy();
  });

  it("shows the status for the challenge", () => {
    const { findByText } = render(<UserProfile />);

    expect(findByText("Done")).toBeTruthy();
  });
});
