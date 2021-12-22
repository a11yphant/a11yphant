import { registerEnumType } from "@nestjs/graphql";

export enum ResetPasswordResultEnum {
  SUCCESS = "SUCCESS",
  INVALID_TOKEN = "INVALID_TOKEN",
  INPUT_VALIDATION_ERROR = "INPUT_VALIDATION_ERROR",
}

registerEnumType(ResetPasswordResultEnum, {
  name: "ResetPasswordResultEnum",
  description: "The result of a reset password operation.",
});
