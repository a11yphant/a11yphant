import { registerEnumType } from "@nestjs/graphql";

export enum ResendEmailConfirmationResultEnum {
  SUCCESSFUL = "successful",
  ALREADY_VERIFIED = "already-verified",
  NOT_APPLICABLE = "email-confirmation-successful",
}

registerEnumType(ResendEmailConfirmationResultEnum, {
  name: "ResendEmailConfirmationResultEnum",
  description: "The possible results when trying to resend the confirmation email.",
});
