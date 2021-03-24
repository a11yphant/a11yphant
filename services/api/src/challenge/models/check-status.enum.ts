import { registerEnumType } from "@nestjs/graphql";

export enum CheckStatus {
  SUCCESS,
  FAIL,
}

registerEnumType(CheckStatus, {
  name: "CheckStatus",
  valuesMap: {
    SUCCESS: {
      description: "The user fulfilled the check/requirement.",
    },
    FAIL: {
      description: "The user failed the check/requirement.",
    },
  },
});
