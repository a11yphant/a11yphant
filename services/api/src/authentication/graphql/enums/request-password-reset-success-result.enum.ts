import { registerEnumType } from "@nestjs/graphql";

export enum RequestPasswordResetSuccessResultEnum {
  EMAIL_SENT = "EMAIL_SENT",
}

registerEnumType(RequestPasswordResetSuccessResultEnum, {
  name: "RequestPasswordResetSuccessResultEnum",
  description: "The result of a request password reset operation.",
});
