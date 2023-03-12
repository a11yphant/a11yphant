import { render, screen } from "@testing-library/react";
import { EmailConfirmationFailedMessage } from "app/components/common/flashMessage/messages/EmailConfirmationFailedMessage";
import { EmailConfirmationSuccessfulMessage } from "app/components/common/flashMessage/messages/EmailConfirmationSuccessfulMessage";
import { FlashMessageEnum, getFlashMessage } from "app/components/common/flashMessage/messages/getFlashMessage";
import { HintReminderMessage } from "app/components/common/flashMessage/messages/HintReminderMessage";
import { OAuthLoginFailedMessage } from "app/components/common/flashMessage/messages/OAuthLoginFailedMessage";

jest.mock("app/components/common/flashMessage/messages/HintReminderMessage", () => ({
  __esModule: true,
  HintReminderMessage: jest.fn(),
}));

jest.mock("app/components/common/flashMessage/messages/EmailConfirmationFailedMessage", () => ({
  __esModule: true,
  EmailConfirmationFailedMessage: jest.fn(),
}));

jest.mock("app/components/common/flashMessage/messages/EmailConfirmationSuccessfulMessage", () => ({
  __esModule: true,
  EmailConfirmationSuccessfulMessage: jest.fn(),
}));

jest.mock("app/components/common/flashMessage/messages/OAuthLoginFailedMessage", () => ({
  __esModule: true,
  OAuthLoginFailedMessage: jest.fn(),
}));

const HintReminderMock = "HintReminder";
const EmailConfirmationFailedMock = "Failed";
const EmailConfirmationSuccessfulMock = "Successful";
const OAuthLoginFailedMock = "Failed";

describe("getFlashMessage", () => {
  it("get HintReminder message", () => {
    (HintReminderMessage as jest.Mock).mockReturnValue(HintReminderMock);

    render(getFlashMessage(FlashMessageEnum.HINT_REMINDER).message);
    expect(screen.getByText(HintReminderMock)).toBeInTheDocument();
  });

  it("get EmailConfirmationSuccessful message", () => {
    (EmailConfirmationSuccessfulMessage as jest.Mock).mockReturnValue(EmailConfirmationSuccessfulMock);

    render(getFlashMessage(FlashMessageEnum.EMAIL_CONFIRMATION_SUCCESSFUL).message);
    expect(screen.getByText(EmailConfirmationSuccessfulMock)).toBeInTheDocument();
  });

  it("get EmailConfirmationFailed message", () => {
    (EmailConfirmationFailedMessage as jest.Mock).mockReturnValue(EmailConfirmationFailedMock);

    render(getFlashMessage(FlashMessageEnum.EMAIL_CONFIRMATION_FAILED).message);
    expect(screen.getByText(EmailConfirmationFailedMock)).toBeInTheDocument();
  });

  it("get OAuthLoginFail message", () => {
    (OAuthLoginFailedMessage as jest.Mock).mockReturnValue(OAuthLoginFailedMock);

    render(getFlashMessage(FlashMessageEnum.OAUTH_LOGIN_FAILED).message);
    expect(screen.getByText(OAuthLoginFailedMock)).toBeInTheDocument();
  });
});
