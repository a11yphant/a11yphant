import { createMockClient } from "@apollo/client/testing";
import { routes } from "app/components/breadcrumbs/routes";
import { ChallengeBySlugDocument, ChallengeBySlugQuery } from "app/generated/graphql";

describe("Routes", () => {
  it("can create breadcrumb infos for the '/' route", async () => {
    const breadcrumbInfo = await routes["/"].getBreadcrumbInfo({});

    expect(breadcrumbInfo.href).toBe("/");
    expect(breadcrumbInfo.breadcrumb).toBe("Challenges");
  });

  it("can create breadcrumb infos for the '/challenge/[challengeSlug]' route", async () => {
    const challengeSlug = "test-challenge";
    const name = "Test Challenge";
    const mockClient = createMockClient<ChallengeBySlugQuery>(
      {
        challenge: {
          id: "242003d6-402e-49b7-9ec2-702445b37c8e",
          name: name,
          levels: [],
        },
      },
      ChallengeBySlugDocument,
      { slug: challengeSlug },
    );

    const breadcrumbInfo = await routes["/challenge/[challengeSlug]"].getBreadcrumbInfo({ challengeSlug }, mockClient);

    expect(breadcrumbInfo.href).toBe(`/?challenge=${challengeSlug}`);
    expect(breadcrumbInfo.breadcrumb).toBe(name);
  });

  it("can create breadcrumb infos for the '/challenge/[challengeSlug]/level/[nthLevel]' route", async () => {
    const challengeSlug = "test-challenge";
    const nthLevel = "5";

    const breadcrumbInfo = await routes["/challenge/[challengeSlug]/level/[nthLevel]"].getBreadcrumbInfo({ challengeSlug, nthLevel });

    expect(breadcrumbInfo.href).toBe(`/challenge/${challengeSlug}/level/${nthLevel}`);
    expect(breadcrumbInfo.breadcrumb).toBe(`Level 0${nthLevel}`);
  });

  it("can create breadcrumb infos for the '/challenge/[challengeSlug]/level/[nthLevel]/evaluation' route", async () => {
    const challengeSlug = "test-challenge";
    const nthLevel = "5";

    const breadcrumbInfo = await routes["/challenge/[challengeSlug]/level/[nthLevel]/evaluation"].getBreadcrumbInfo({ challengeSlug, nthLevel });

    expect(breadcrumbInfo.href).toBe(`/challenge/${challengeSlug}/level/${nthLevel}/evaluation`);
    expect(breadcrumbInfo.breadcrumb).toBe("Evaluation");
  });
});
