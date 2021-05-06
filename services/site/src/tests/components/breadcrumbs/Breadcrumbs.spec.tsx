import { MockedProvider } from "@apollo/client/testing";
import { act, cleanup, render, screen } from "@testing-library/react";
import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import React from "react";

afterEach(cleanup);

// expected breadcrumbs
const challengeSlug = "mock-challenge-1";
const expectedBreadcrumbHome = {
  href: "/",
  breadcrumb: "Mock Home",
};
const expectedBreadcrumbChallenge = {
  href: `/challenge/${challengeSlug}`,
  breadcrumb: "Mock First Challenge",
};

jest.mock("next/router", () => ({
  useRouter() {
    return {
      pathname: `/challenge/[challengeSlug]`,
      query: { challengeSlug: challengeSlug },
    };
  },
}));

jest.mock("app/components/breadcrumbs/getRouteList", () => ({
  getRouteList: async () => {
    return [
      {
        ...expectedBreadcrumbHome,
      },
      {
        ...expectedBreadcrumbChallenge,
      },
    ];
  },
}));

describe("Breadcrumbs", () => {
  it("render correctly", async () => {
    let container;
    await act(async () => {
      const component = render(
        <MockedProvider>
          <Breadcrumbs />
        </MockedProvider>,
      );
      container = component.container;
    });

    expect(screen.queryByRole("navigation")).toBeTruthy();
    expect(screen.queryByRole("list")).toBeTruthy();
    expect(container.querySelectorAll("li")).toHaveProperty("length", 2);

    // Slash is rendered
    expect(container.querySelectorAll("svg")).toHaveProperty("length", 1);

    // Breadcrumb Home is rendered
    expect(screen.getByText(expectedBreadcrumbHome.breadcrumb).closest("a")).toHaveAttribute("href", expectedBreadcrumbHome.href);

    // Breadcrumb Challenge is rendered
    expect(screen.getByText(expectedBreadcrumbChallenge.breadcrumb).closest("a")).toHaveAttribute("href", expectedBreadcrumbChallenge.href);
  });
});
