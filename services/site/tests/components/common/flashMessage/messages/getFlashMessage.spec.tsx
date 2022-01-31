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
    (HintReminderMessage as jest.Mock).mockImplementation(() => HintReminderMock);

    expect((getFlashMessage(FlashMessageEnum.HINT_REMINDER) as () => string)()).toEqual(HintReminderMock);
  });

  it("get EmailConfirmationSuccessful message", () => {
    (EmailConfirmationSuccessfulMessage as jest.Mock).mockImplementation(() => EmailConfirmationSuccessfulMock);

    expect((getFlashMessage(FlashMessageEnum.EMAIL_CONFIRMATION_SUCCESSFUL) as () => string)()).toEqual(EmailConfirmationSuccessfulMock);
  });

  it("get EmailConfirmationFailed message", () => {
    (EmailConfirmationFailedMessage as jest.Mock).mockImplementation(() => EmailConfirmationFailedMock);

    expect((getFlashMessage(FlashMessageEnum.EMAIL_CONFIRMATION_FAILED) as () => string)()).toEqual(EmailConfirmationFailedMock);
  });
});
