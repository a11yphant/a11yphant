import { registerEnumType } from "@nestjs/graphql";

export enum RequestPasswordResetFields {
  EMAIL = "EMAIL",
}

registerEnumType(RequestPasswordResetFields, {
  name: "RequestPasswordResetFields",
  description: "The fields used to request a password reset.",
});
