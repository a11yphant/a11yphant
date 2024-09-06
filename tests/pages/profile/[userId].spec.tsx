import { render, screen } from "@testing-library/react";
import { initializeApollo } from "app/lib/apollo-client";
import UserProfile, { getServerSideProps } from "app/pages/profile/[userId]";
import { GetServerSidePropsContext } from "next";
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
          name: "Dummy Challenge 1",
          statusForUser: "FINISHED",
        },
        {
          id: "436eb074-8c77-4ce0-a0a5-4344d78f3748",
          name: "Dummy Challenge 2",
          statusForUser: "OPEN",
        },
        {
          id: "cc2f1f26-a724-40a1-a542-7b8ca693e3ab",
          name: "Dummy Challenge 3",
          statusForUser: "IN_PROGRESS",
        },
      ],
    },
  }),
  ChallengeStatus: {
    Finished: "FINISHED",
    InProgress: "IN_PROGRESS",
    Open: "OPEN",
  },
}));

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock("app/lib/apollo-client", () => ({
  __esModule: true,
  initializeApollo: jest.fn().mockReturnValue({
    query: jest.fn(),
  }),
}));

describe("user profile page", () => {
  describe("component", () => {
    it("renders the name of the user", () => {
      render(<UserProfile />);

      expect(screen.getByText(/Hans Schröder/)).toBeInTheDocument();
    });

    it("renders the amount of finished and open challenges", () => {
      render(<UserProfile />);

      expect(screen.getByText("1/3")).toBeInTheDocument();
    });

    it("renders a finished challenge", () => {
      render(<UserProfile />);

      expect(screen.getByText("Dummy Challenge 1")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByText("Completed", { selector: "h3" }).parentElement.innerHTML).toContain("Dummy Challenge 1");
    });

    it("renders an open challenge", () => {
      render(<UserProfile />);

      expect(screen.getByText("Dummy Challenge 2")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByText("Not started yet", { selector: "h3" }).parentElement.innerHTML).toContain("Dummy Challenge 2");
    });

    it("renders a challenge that is in progress", () => {
      render(<UserProfile />);

      expect(screen.getByText("Dummy Challenge 3")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByText("Currently coding", { selector: "h3" }).parentElement.innerHTML).toContain("Dummy Challenge 3");
    });
  });

  describe("getServerSideProps", () => {
    it("returns an initial apollo state", async () => {
      (initializeApollo as jest.Mock).mockReturnValue({
        query: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: "0f00f41d-d782-4bba-9aac-fd5a929ab318",
              displayName: "Hans Schröder",
            },
          },
        }),
        cache: {
          extract: jest.fn().mockReturnValue({}),
        },
      });
      const context: Partial<GetServerSidePropsContext> = {
        req: { headers: { host: "a11yphant.com" } } as GetServerSidePropsContext["req"],
        params: {
          userId: "92136047-3a39-4c22-bc09-ead41b8e2e08",
        },
      };

      // typescript assumes that the return type is { redirect: Redirect } and then complains about accessing props
      const serverSideProps = (await getServerSideProps(context as GetServerSidePropsContext)) as any;
      expect(serverSideProps).toBeTruthy();
      expect(serverSideProps.props).toBeTruthy();
      expect(serverSideProps.props.initialApolloState).toBeTruthy();
    });

    it("returns `not found` if the user was not found", async () => {
      (initializeApollo as jest.Mock).mockReturnValue({
        query: jest.fn().mockResolvedValue({
          data: {
            user: null,
          },
        }),
      });
      const context: Partial<GetServerSidePropsContext> = {
        req: { headers: { host: "a11yphant.com" } } as GetServerSidePropsContext["req"],
        params: {
          userId: "92136047-3a39-4c22-bc09-ead41b8e2e08",
        },
      };

      // typescript assumes that the return type is { redirect: Redirect } and then complains about accessing not found
      const serverSideProps = (await getServerSideProps(context as GetServerSidePropsContext)) as any;
      expect(serverSideProps).toBeTruthy();
      expect(serverSideProps.notFound).toBeTruthy();
    });
  });
});
