import { registerEnumType } from "@nestjs/graphql";

export enum RequestPasswordResetErrorCodes {
  INPUT_VALIDATION_ERROR = "INPUT_VALIDATION_ERROR",
}

registerEnumType(RequestPasswordResetErrorCodes, {
  name: "RequestPasswordResetErrorCodes",
  description: "The error code for the reason for the failure.",
});
