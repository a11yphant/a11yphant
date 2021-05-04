import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { act, cleanup, render, screen } from "@testing-library/react";
import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import { RouteInfo, Routes } from "app/components/breadcrumbs/routes";
import { ChallengeBySlugDocument, ChallengeBySlugQuery, ChallengeBySlugQueryVariables } from "app/generated/graphql";
import React from "react";

afterEach(cleanup);

// expected breadcrumbs
const challengeSlug = "challenge-1";
const expectedBreadcrumbHome = {
  href: "/",
  breadcrumb: "Home",
};
const expectedBreadcrumbChallenge = {
  href: `/challenge/${challengeSlug}`,
  breadcrumb: "Challenge 1",
};

// apollo mocks
const mocks: MockedResponse[] = [
  {
    request: {
      query: ChallengeBySlugDocument,
      variables: {
        slug: challengeSlug,
      },
    },
    result: {
      data: {
        challenge: {
          id: "242003d6-402e-49b7-9ec2-702445b37c8e",
          name: expectedBreadcrumbChallenge.breadcrumb,
          levels: [{ id: "ab2c61e0-f7fe-4bec-98b6-c0eeb0d5a66d" }],
        },
      },
    },
  },
];

// routes
const mockedHomeRoute: RouteInfo = {
  getBreadcrumbInfo: jest.fn(async () => {
    return expectedBreadcrumbHome;
  }),
};
const mockedChallengeRoute: RouteInfo = {
  getBreadcrumbInfo: jest.fn(async (urlParams, apolloClient) => {
    const { challengeSlug } = urlParams;

    const { data } = await apolloClient.query<ChallengeBySlugQuery, ChallengeBySlugQueryVariables>({
      query: ChallengeBySlugDocument,
      variables: { slug: challengeSlug as string },
    });

    return {
      href: `/challenge/${challengeSlug}`,
      breadcrumb: data.challenge?.name,
    };
  }),
};
const mockedRoutes: Routes = {
  "/": mockedHomeRoute,
  "/challenge/[challengeSlug]": mockedChallengeRoute,
};

jest.mock("next/router", () => ({
  useRouter() {
    return {
      pathname: `/challenge/[challengeSlug]`,
      query: { challengeSlug: challengeSlug },
    };
  },
}));

jest.mock("app/components/breadcrumbs/routes");
jest.mock("app/components/breadcrumbs/getRouteList");

describe("Breadcrumbs", () => {
  it("renders correctly", async () => {
    // const container = document.createElement("div");
    // document.body.appendChild(container);

    let container;
    await act(async () => {
      const component = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Breadcrumbs />
        </MockedProvider>,
      );
      container = component.container;
    });

    expect(screen.queryByRole("navigation")).toBeTruthy();
    expect(screen.queryByRole("list")).toBeTruthy();
    expect(container.querySelectorAll("li")).toHaveProperty("length", 1);
    // Test for Slash
    // expect(container.querySelectorAll("svg")).toHaveProperty("length", 1);

    // Breadcrumb Home
    // expect(container.querySelectorAll("span")).toHaveProperty("length", 1);
    // expect(screen.getByText(expectedBreadcrumbHome.breadcrumb).closest("a")).toHaveAttribute("href", expectedBreadcrumbHome.href);

    // Breadcrumb Challenge
    // expect(screen.getByText(expectedBreadcrumbChallenge.breadcrumb).closest("a")).toHaveAttribute("href", expectedBreadcrumbChallenge.href);
  });
});
