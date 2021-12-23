import { registerEnumType } from "@nestjs/graphql";

export enum ResetPasswordFields {
  PASSWORD = "password",
}

registerEnumType(ResetPasswordFields, {
  name: "ResetPasswordFields",
  description: "The fields that can be used to reset a password.",
});
