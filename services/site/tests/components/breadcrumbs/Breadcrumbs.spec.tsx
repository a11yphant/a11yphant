import { MockedProvider } from "@apollo/client/testing";
import { act } from "@testing-library/react";
import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import Slash from "app/components/icons/Slash";
import { mount, ReactWrapper } from "enzyme";
import router, { NextRouter } from "next/router";
import React from "react";

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

jest.mock("app/components/breadcrumbs/getRouteList", () => ({
  getRouteList: async (router: NextRouter) => {
    // Otherwise: ReferenceError: Cannot access 'challengeSlug' before initialization
    // because of hoisting
    // eslint-disable-next-line
    const dummy = challengeSlug;

    if (router.pathname === "/") {
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
  },
}));

jest.mock("next/router", () => require("next-router-mock"));

const renderBreadcrumbs = async (): Promise<ReactWrapper> => {
  const wrapper = mount(
    <MockedProvider>
      <Breadcrumbs />
    </MockedProvider>,
  );

  await act(async () => {
    await wrapper;
    wrapper.update();
  });

  return wrapper;
};

describe("Breadcrumbs", () => {
  it("renders no navigation and no list if there is only one breadcrumb", async () => {
    await act(async () => {
      router.push("/");
    });

    const view = await renderBreadcrumbs();

    expect(view.exists("nav")).toBeFalsy();
    expect(view.exists("ol")).toBeFalsy();
  });

  it("renders no slash if there is only one breadcrumb", async () => {
    await act(async () => {
      router.push("/");
    });

    const view = await renderBreadcrumbs();

    expect(view.exists(Slash)).toBeFalsy();
  });

  it("renders two breadcrumbs with dividing slashes", async () => {
    await act(async () => {
      router.push({
        pathname: "/challenge/[challengeSlug]",
        query: { challengeSlug: challengeSlug },
      });
    });

    const view = await renderBreadcrumbs();

    expect(view.exists("nav")).toBeTruthy();
    expect(view.exists("ol")).toBeTruthy();

    expect(view.find("li")).toHaveLength(2);

    // Breadcrumb Home is rendered
    expect(view.find("li a").first().text()).toBe(expectedBreadcrumbHome.breadcrumb);

    // Dividing Slash is rendered
    expect(view.exists(Slash)).toBeTruthy();

    // Breadcrumb Challenge is rendered
    expect(view.find("li a").at(1).text()).toBe(expectedBreadcrumbChallenge.breadcrumb);
  });
});
