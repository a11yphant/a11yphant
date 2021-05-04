import { createMockClient } from "@apollo/client/testing";
import { cleanup } from "@testing-library/react";
import { getRouteList } from "app/components/breadcrumbs/getRouteList";
import { ChallengeBySlugDocument, ChallengeBySlugQuery } from "app/generated/graphql";
import router from "next/router";

afterEach(cleanup);

const challengeSlug = "challenge-1";
const expectedBreadcrumbHome = {
  href: "/",
  breadcrumb: "Home",
};
const expectedBreadcrumbChallenge = {
  href: `/challenge/${challengeSlug}`,
  breadcrumb: "First Challenge",
};

jest.mock("app/components/breadcrumbs/routes");
jest.mock("next/router", () => require("next-router-mock"));

let mockClient;

beforeEach(() => {
  mockClient = createMockClient<ChallengeBySlugQuery>(
    {
      challenge: {
        id: "242003d6-402e-49b7-9ec2-702445b37c8e",
        name: "First Challenge",
        levels: [{ id: "5557e647-7a14-47b7-b51c-142f25cc998c" }, { id: "0682b540-67cb-45b6-bdf3-692fb78e871d" }],
      },
    },
    ChallengeBySlugDocument,
    { slug: challengeSlug },
  );
});

describe("getRouteList", () => {
  it("home route", async () => {
    router.push("/");
    const routeList = await getRouteList(router, mockClient);

    expect(routeList).toEqual([expectedBreadcrumbHome]);
  });

  it("challenge route (with apollo request)", async () => {
    router.push({
      pathname: "/challenge/[challengeSlug]",
      query: { challengeSlug: challengeSlug },
    });

    const routeList = await getRouteList(router, mockClient);

    expect(routeList).toEqual([expectedBreadcrumbHome, expectedBreadcrumbChallenge]);
  });
});
