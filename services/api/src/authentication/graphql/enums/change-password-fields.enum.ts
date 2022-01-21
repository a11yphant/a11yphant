import { registerEnumType } from "@nestjs/graphql";

export enum ChangePasswordFields {
  CURRENT_PASSWORD = "current-password",
  NEW_PASSWORD = "new-password",
}

registerEnumType(ChangePasswordFields, {
  name: "ChangePasswordFields",
  description: "The fields that can be used to change a password.",
});
