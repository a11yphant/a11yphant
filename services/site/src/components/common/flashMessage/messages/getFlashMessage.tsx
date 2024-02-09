import { EmailConfirmationFailedMessage } from "app/components/common/flashMessage/messages/EmailConfirmationFailedMessage";
import { EmailConfirmationSuccessfulMessage } from "app/components/common/flashMessage/messages/EmailConfirmationSuccessfulMessage";
import { HintReminderMessage } from "app/components/common/flashMessage/messages/HintReminderMessage";
import { OAuthLoginFailedMessage } from "app/components/common/flashMessage/messages/OAuthLoginFailedMessage";
import React from "react";

import { FlashMessageType } from "../FlashMessage";

export enum FlashMessageEnum {
  HINT_REMINDER = "hint-reminder",
  EMAIL_CONFIRMATION_FAILED = "email-confirmation-failed",
  EMAIL_CONFIRMATION_SUCCESSFUL = "email-confirmation-successful",
  OAUTH_LOGIN_FAILED = "oauth-login-failed",
  LOGIN_SUCCESS = "login-success",
}

interface FlashMessage {
  message: React.ReactElement;
  type: FlashMessageType;
}

type FlashMessages = {
  [key in FlashMessageEnum]: FlashMessage;
};

const flashMessages: FlashMessages = {
  [FlashMessageEnum.HINT_REMINDER]: { message: <HintReminderMessage />, type: FlashMessageType.STATUS },
  [FlashMessageEnum.EMAIL_CONFIRMATION_FAILED]: { message: <EmailConfirmationFailedMessage />, type: FlashMessageType.ALERT },
  [FlashMessageEnum.EMAIL_CONFIRMATION_SUCCESSFUL]: { message: <EmailConfirmationSuccessfulMessage />, type: FlashMessageType.STATUS },
  [FlashMessageEnum.OAUTH_LOGIN_FAILED]: { message: <OAuthLoginFailedMessage />, type: FlashMessageType.ALERT },
  [FlashMessageEnum.LOGIN_SUCCESS]: { message: <>Welcome back!</>, type: FlashMessageType.STATUS },
};

export const getFlashMessage = (flashMessageEnum: FlashMessageEnum): FlashMessage => {
  return flashMessages[flashMessageEnum];
};
