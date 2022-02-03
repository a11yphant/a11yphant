import { render, screen } from "@testing-library/react";
import { EmailConfirmationFailedMessage } from "app/components/common/flashMessage/messages/EmailConfirmationFailedMessage";
import { EmailConfirmationSuccessfulMessage } from "app/components/common/flashMessage/messages/EmailConfirmationSuccessfulMessage";
import { FlashMessageEnum, getFlashMessage } from "app/components/common/flashMessage/messages/getFlashMessage";
import { HintReminderMessage } from "app/components/common/flashMessage/messages/HintReminderMessage";

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

const HintReminderMock = "HintReminder";
const EmailConfirmationFailedMock = "Failed";
const EmailConfirmationSuccessfulMock = "Successful";

describe("getFlashMessage", () => {
  it("get HintReminder message", () => {
    (HintReminderMessage as jest.Mock).mockReturnValue(HintReminderMock);

    render(getFlashMessage(FlashMessageEnum.HINT_REMINDER));
    expect(screen.getByText(HintReminderMock)).toBeInTheDocument();
  });

  it("get EmailConfirmationSuccessful message", () => {
    (EmailConfirmationSuccessfulMessage as jest.Mock).mockReturnValue(EmailConfirmationSuccessfulMock);

    render(getFlashMessage(FlashMessageEnum.EMAIL_CONFIRMATION_SUCCESSFUL));
    expect(screen.getByText(EmailConfirmationSuccessfulMock)).toBeInTheDocument();
  });

  it("get EmailConfirmationFailed message", () => {
    (EmailConfirmationFailedMessage as jest.Mock).mockReturnValue(EmailConfirmationFailedMock);

    render(getFlashMessage(FlashMessageEnum.EMAIL_CONFIRMATION_FAILED));
    expect(screen.getByText(EmailConfirmationFailedMock)).toBeInTheDocument();
  });
});
