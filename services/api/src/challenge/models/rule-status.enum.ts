import { registerEnumType } from "@nestjs/graphql";

export enum RuleStatus {
  SUCCESS,
  FAIL,
}

registerEnumType(RuleStatus, {
  name: "RuleStatus",
  valuesMap: {
    SUCCESS: {
      description: "The user fulfilled the check/requirement.",
    },
    FAIL: {
      description: "The user failed the check/requirement.",
    },
  },
});
