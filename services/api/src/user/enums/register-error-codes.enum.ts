import { registerEnumType } from "@nestjs/graphql";

export enum RegisterErrorCodes {
  ANONYMOUS_USER_INVALID = "ANONYMOUS_USER_INVALID",
  EMAIL_IN_USE = "EMAIL_IN_USE",
  USER_ALREADY_REGISTERED = "USER_ALREADY_REGISTERED",
}

registerEnumType(RegisterErrorCodes, {
  name: "RegisterErrorCodes",
  description: "The possible error codes for registering a new user.",
});
