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

  it("can create breadcrumb infos for the '/challenges' route", async () => {
    const breadcrumbInfo = await match("/challenges")?.getBreadcrumbInfo({}, mockClient);

    expect(breadcrumbInfo?.href).toBe("/challenges");
    expect(breadcrumbInfo?.breadcrumb).toBe("Challenges");
  });

  it("can create breadcrumb infos for the '/challenges/[challengeSlug]' route", async () => {
    const breadcrumbInfo = await match(`/challenges/${challengeSlug}`)?.getBreadcrumbInfo({ challengeSlug }, mockClient);

    expect(breadcrumbInfo?.href).toBe(`/challenges/${challengeSlug}`);
    expect(breadcrumbInfo?.breadcrumb).toBe(name);
  });

  it("can create breadcrumb infos for the '/challenges/[challengeSlug]/level/[nthLevel]' route", async () => {
    const nthLevel = "5";

    const breadcrumbInfo = await match(`/challenges/${challengeSlug}/level/${nthLevel}`)?.getBreadcrumbInfo({ challengeSlug, nthLevel }, mockClient);

    expect(breadcrumbInfo?.href).toBe(`/challenges/${challengeSlug}/level/${nthLevel}`);
    expect(breadcrumbInfo?.breadcrumb).toBe(`Level 0${nthLevel}`);
  });

  it("can create breadcrumb infos for the '/challenges/[challengeSlug]/level/[nthLevel]/evaluation' route", async () => {
    const nthLevel = "5";

    const breadcrumbInfo = await match(`/challenges/${challengeSlug}/level/${nthLevel}/evaluation`)?.getBreadcrumbInfo(
      { challengeSlug, nthLevel },
      mockClient,
    );

    expect(breadcrumbInfo?.href).toBe(`/challenges/${challengeSlug}/level/${nthLevel}/evaluation`);
    expect(breadcrumbInfo?.breadcrumb).toBe("Evaluation");
  });
});
