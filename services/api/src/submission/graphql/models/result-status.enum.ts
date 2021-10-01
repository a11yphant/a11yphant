import { registerEnumType } from "@nestjs/graphql";

export enum ResultStatus {
  SUCCESS,
  FAIL,
  PENDING,
  ERROR,
}

registerEnumType(ResultStatus, {
  name: "ResultStatus",
  description: "The possible stati of a submission result.",
  valuesMap: {
    SUCCESS: {
      description: "The user passed the level.",
    },
    FAIL: {
      description: "The user failed the level.",
    },
    PENDING: {
      description: "The submission needs to be checked. The result is not yet available.",
    },
    ERROR: {
      description: "An error occurred. Please call Luca.",
    },
  },
});
