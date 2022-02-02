import { EmailConfirmationFailedMessage } from "app/components/common/flashMessage/messages/EmailConfirmationFailedMessage";
import { EmailConfirmationSuccessfulMessage } from "app/components/common/flashMessage/messages/EmailConfirmationSuccessfulMessage";
import { HintReminderMessage } from "app/components/common/flashMessage/messages/HintReminderMessage";
import React from "react";

export enum FlashMessageEnum {
  HINT_REMINDER = "hint-reminder",
  EMAIL_CONFIRMATION_FAILED = "email-confirmation-failed",
  EMAIL_CONFIRMATION_SUCCESSFUL = "email-confirmation-successful",
}

type FlashMessages = {
  [key in FlashMessageEnum]: React.ReactNode;
};

const flashMessages: FlashMessages = {
  [FlashMessageEnum.HINT_REMINDER]: <HintReminderMessage />,
  [FlashMessageEnum.EMAIL_CONFIRMATION_FAILED]: <EmailConfirmationFailedMessage />,
  [FlashMessageEnum.EMAIL_CONFIRMATION_SUCCESSFUL]: <EmailConfirmationSuccessfulMessage />,
};

export const getFlashMessage = (flashMessageEnum: FlashMessageEnum): React.ReactNode => {
  return flashMessages[flashMessageEnum];
};
