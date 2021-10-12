import { cleanup, render } from "@testing-library/react";
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

jest.mock("app/lib/apollo-client", () => ({
  __esModule: true,
  initializeApollo: jest.fn().mockReturnValue({
    query: jest.fn(),
  }),
}));

afterEach(cleanup);

describe("user profile page", () => {
  describe("component", () => {
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

    it("returns not found if the user was not found", async () => {
      (initializeApollo as jest.Mock).mockReturnValue({
        query: jest.fn().mockResolvedValue({
          data: {
            user: null,
          },
        }),
      });
      const context: Partial<GetServerSidePropsContext> = {
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
