import { MockedProvider } from "@apollo/client/testing";
import { act, cleanup } from "@testing-library/react";
import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import Slash from "app/components/icons/Slash";
import { mount, ReactWrapper } from "enzyme";
import router, { NextRouter } from "next/router";
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
  it("one breadcrumb", async () => {
    await act(async () => {
      router.push("/");
    });

    const wrapper = await renderBreadcrumbs();

    expect(wrapper.exists("nav")).toBeFalsy();
    expect(wrapper.exists("ol")).toBeFalsy();

    // No Slash is rendered
    expect(wrapper.exists(Slash)).toBeFalsy();
  });

  it("two breadcrumbs", async () => {
    await act(async () => {
      router.push({
        pathname: "/challenge/[challengeSlug]",
        query: { challengeSlug: challengeSlug },
      });
    });

    const wrapper = await renderBreadcrumbs();

    expect(wrapper.exists("nav")).toBeTruthy();
    expect(wrapper.exists("ol")).toBeTruthy();

    expect(wrapper.find("li").length).toBe(2);

    // Breadcrumb Home is rendered
    expect(wrapper.find("li a").first().text()).toBe(expectedBreadcrumbHome.breadcrumb);

    // Dividing Slash is rendered
    expect(wrapper.exists(Slash)).toBeTruthy();

    // Breadcrumb Challenge is rendered
    expect(wrapper.find("li a").at(1).text()).toBe(expectedBreadcrumbChallenge.breadcrumb);
  });
});
