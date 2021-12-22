import { getNumFailedLevelsInARowKey } from "app/hooks/sessionState/sessionStateKeys";

describe("getNumFailedLevelsInARowKey", () => {
  const mockChallengeSlug = "mock-challenge";
  const mockNthLevel = "03";

  it("contains challengeSlug", () => {
    expect(getNumFailedLevelsInARowKey(mockChallengeSlug, mockNthLevel)).toContain(mockChallengeSlug);
  });

  it("contains nthLevel as integer", () => {
    expect(getNumFailedLevelsInARowKey(mockChallengeSlug, mockNthLevel)).toContain(Number(mockNthLevel).toString());
  });

  it("contains constant", () => {
    expect(getNumFailedLevelsInARowKey(mockChallengeSlug, mockNthLevel)).toContain("num_failed_levels_in_a_row");
  });
});
