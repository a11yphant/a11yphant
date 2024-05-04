import { MockedProvider } from "@apollo/client/testing";
import { act, render, screen } from "@testing-library/react";
import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import { getRouteList } from "app/components/breadcrumbs/getRouteList";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React from "react";

async function waitForQuery(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

// expected breadcrumbs
const challengeSlug = "mock-challenge-1";
const expectedBreadcrumbHome = {
  href: "/",
  breadcrumb: "Mock Home",
};
const expectedBreadcrumbChallenge = {
  href: `/challenges/${challengeSlug}`,
  breadcrumb: "Mock First Challenge",
};

jest.mock("app/components/breadcrumbs/getRouteList", () => ({ getRouteList: jest.fn() }));

jest.mock("next/navigation", () => ({ usePathname: jest.fn(), useSearchParams: jest.fn(), useParams: jest.fn() }));

beforeEach(() => {
  jest.resetAllMocks();
  (getRouteList as jest.Mock).mockImplementation(async (pathname: string) => {
    // Otherwise: ReferenceError: Cannot access 'challengeSlug' before initialization
    // because of hoisting
    // eslint-disable-next-line
    const dummy = challengeSlug;

    if (pathname === "/") {
      return [
        {
          ...expectedBreadcrumbHome,
        },
      ];
    } else {
      return [
        {
          ...expectedBreadcrumbHome,
        },
        {
          ...expectedBreadcrumbChallenge,
        },
      ];
    }
  });
});

const renderBreadcrumbs = async (): Promise<void> => {
  render(
    <MockedProvider>
      <Breadcrumbs />
    </MockedProvider>,
  );

  await waitForQuery();
};

describe("Breadcrumbs", () => {
  it("renders no navigation and no list if there is only one breadcrumb", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    await renderBreadcrumbs();

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders no slash if there is only one breadcrumb", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    await renderBreadcrumbs();

    expect(screen.queryByRole("img", { hidden: true })).not.toBeInTheDocument();
  });

  it("renders two breadcrumbs with dividing slashes", async () => {
    (usePathname as jest.Mock).mockReturnValue("/challenge/[challengeSlug]");
    (useParams as jest.Mock).mockReturnValue(challengeSlug);
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    await renderBreadcrumbs();

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();

    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    // Breadcrumb Home is rendered
    expect(screen.getByText(expectedBreadcrumbHome.breadcrumb)).toBeInTheDocument();

    // Dividing Slash is rendered
    expect(screen.getByText(expectedBreadcrumbHome.breadcrumb)).toBeInTheDocument();

    // Breadcrumb Challenge is rendered
    expect(screen.getByText(expectedBreadcrumbChallenge.breadcrumb)).toBeInTheDocument();
  });
});
