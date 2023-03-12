import { registerEnumType } from "@nestjs/graphql";

export enum RegisterErrorCodes {
  INVALID_USER = "INVALID_USER",
}

registerEnumType(RegisterErrorCodes, {
  name: "RegisterResultEnum",
  description: "The possible error codes for registering a new user.",
});
