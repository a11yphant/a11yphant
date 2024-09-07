const NUM_FAILED_LEVELS_IN_A_ROW_Key = "num_failed_levels_in_a_row";

export const getNumFailedLevelsInARowKey = (challengeSlug: string, nthLevel: string): string => {
  return `${NUM_FAILED_LEVELS_IN_A_ROW_Key}.${challengeSlug}.${Number(nthLevel)}`;
};
