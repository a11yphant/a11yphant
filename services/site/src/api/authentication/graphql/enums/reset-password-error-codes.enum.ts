import { registerEnumType } from "@nestjs/graphql";

export enum ResetPasswordErrorCodes {
  INVALID_TOKEN = "INVALID_TOKEN",
  INPUT_VALIDATION_ERROR = "INPUT_VALIDATION_ERROR",
}

registerEnumType(ResetPasswordErrorCodes, {
  name: "ResetPasswordResultEnum",
  description: "The possible error codes for resetting the password.",
});
