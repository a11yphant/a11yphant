import { registerEnumType } from "@nestjs/graphql";

export enum ChangePasswordSuccessResultEnum {
  SUCCESS = "SUCCESS",
}

registerEnumType(ChangePasswordSuccessResultEnum, {
  name: "ChangePasswordSuccessResultEnum",
  description: "The result of a password change operation.",
});
