import { registerEnumType } from "@nestjs/graphql";

export enum ValidatePasswordResetTokenResultEnum {
  VALID = "VALID",
  EXPIRED = "EXPIRED",
  UNKNOWN_USER = "UNKNOWN_USER",
  INVALID_TOKEN = "INVALID_TOKEN",
}

registerEnumType(ValidatePasswordResetTokenResultEnum, {
  name: "ValidatePasswordResetTokenResultEnum",
  description: "The possible results of validating a password reset token.",
});
