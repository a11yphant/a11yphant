import { registerEnumType } from "@nestjs/graphql";

export enum ChangePasswordErrorCodes {
  INVALID_OPERATION = "INVALID_OPERATION",
  BAD_USER_INPUT = "BAD_USER_INPUT",
}

registerEnumType(ChangePasswordErrorCodes, {
  name: "ChangePasswordResultEnum",
  description: "The possible error codes for changing the password.",
});
