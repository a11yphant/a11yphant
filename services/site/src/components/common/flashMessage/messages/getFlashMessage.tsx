import { EmailConfirmationFailedMessage } from "app/components/common/flashMessage/messages/EmailConfirmationFailedMessage";
import { EmailConfirmationSuccessfulMessage } from "app/components/common/flashMessage/messages/EmailConfirmationSuccessfulMessage";
import { HintReminderMessage } from "app/components/common/flashMessage/messages/HintReminderMessage";
import { OAuthLoginFailedMessage } from "app/components/common/flashMessage/messages/OAuthLoginFailedMessage";
import React from "react";

export enum FlashMessageEnum {
  HINT_REMINDER = "hint-reminder",
  EMAIL_CONFIRMATION_FAILED = "email-confirmation-failed",
  EMAIL_CONFIRMATION_SUCCESSFUL = "email-confirmation-successful",
  OAUTH_LOGIN_FAILED = "oauth-login-failed",
}

type FlashMessages = {
  [key in FlashMessageEnum]: React.ReactElement;
};

const flashMessages: FlashMessages = {
  [FlashMessageEnum.HINT_REMINDER]: <HintReminderMessage />,
  [FlashMessageEnum.EMAIL_CONFIRMATION_FAILED]: <EmailConfirmationFailedMessage />,
  [FlashMessageEnum.EMAIL_CONFIRMATION_SUCCESSFUL]: <EmailConfirmationSuccessfulMessage />,
  [FlashMessageEnum.OAUTH_LOGIN_FAILED]: <OAuthLoginFailedMessage />,
};

export const getFlashMessage = (flashMessageEnum: FlashMessageEnum): React.ReactElement => {
  return flashMessages[flashMessageEnum];
};
