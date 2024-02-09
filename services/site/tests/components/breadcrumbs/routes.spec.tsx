import { createMockClient } from "@apollo/client/testing";
import { match } from "app/components/breadcrumbs/routes";
import { ChallengeBySlugDocument, ChallengeBySlugQuery } from "app/generated/graphql";

describe("Routes", () => {
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

  it("can create breadcrumb infos for the '/' route", async () => {
    const breadcrumbInfo = await match("/")?.getBreadcrumbInfo({}, mockClient);

    expect(breadcrumbInfo?.href).toBe("/");
    expect(breadcrumbInfo?.breadcrumb).toBe("Challenges");
  });

  it("can create breadcrumb infos for the '/challenge/[challengeSlug]' route", async () => {
    const breadcrumbInfo = await match(`/challenge/${challengeSlug}`)?.getBreadcrumbInfo({ challengeSlug }, mockClient);

    expect(breadcrumbInfo?.href).toBe(`/challenge/${challengeSlug}`);
    expect(breadcrumbInfo?.breadcrumb).toBe(name);
  });

  it("can create breadcrumb infos for the '/challenge/[challengeSlug]/level/[nthLevel]' route", async () => {
    const nthLevel = "5";

    const breadcrumbInfo = await match(`/challenge/${challengeSlug}/level/${nthLevel}`)?.getBreadcrumbInfo({ challengeSlug, nthLevel }, mockClient);

    expect(breadcrumbInfo?.href).toBe(`/challenge/${challengeSlug}/level/${nthLevel}`);
    expect(breadcrumbInfo?.breadcrumb).toBe(`Level 0${nthLevel}`);
  });

  it("can create breadcrumb infos for the '/challenge/[challengeSlug]/level/[nthLevel]/evaluation' route", async () => {
    const nthLevel = "5";

    const breadcrumbInfo = await match(`/challenge/${challengeSlug}/level/${nthLevel}/evaluation`)?.getBreadcrumbInfo(
      { challengeSlug, nthLevel },
      mockClient,
    );

    expect(breadcrumbInfo?.href).toBe(`/challenge/${challengeSlug}/level/${nthLevel}/evaluation`);
    expect(breadcrumbInfo?.breadcrumb).toBe("Evaluation");
  });
});
