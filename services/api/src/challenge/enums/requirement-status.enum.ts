import { registerEnumType } from "@nestjs/graphql";

export enum RequirementStatus {
  SUCCESS,
  FAIL,
  ERROR,
}

registerEnumType(RequirementStatus, {
  name: "RequirementStatus",
  valuesMap: {
    SUCCESS: {
      description: "The user fulfilled the check/requirement.",
    },
    FAIL: {
      description: "The user failed the check/requirement.",
    },
    ERROR: {
      description: "An error occurred while checking this requirement.",
    },
  },
});
