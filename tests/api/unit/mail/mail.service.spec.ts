/**
 * @jest-environment node
 */

import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { createConfigServiceMock } from "@tests/support/helpers";
import { SendMailService } from "app/api/mail/sendMail.service";

import { MailService } from "@/mail/mail.service";
import { SendRegistrationMailContext } from "@/mail/send-registration-mail-context.interface";
import { User } from "@/user/models/user.model";

const getMailService = (
  partials: { sendMailService?: Partial<SendMailService>; logger?: Partial<Logger> } = {},
  configData?: Record<string, any>,
): MailService => {
  const mailerService = createMock<SendMailService>(partials?.sendMailService);
  const config = createMock<ConfigService>(createConfigServiceMock(configData));
  const logger = createMock<Logger>(partials?.logger);

  return new MailService(mailerService, config, logger);
};

function buildContext(user: User = UserFactory.build(), token = "token"): SendRegistrationMailContext {
  return {
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
    token,
  };
}

describe("mailService", () => {
  describe("send registration mail", () => {
    it("sends a registration mail", async () => {
      const sendMail = jest.fn();
      const service = getMailService({ sendMailService: { sendMail } });
      const context = buildContext();

      await service.sendRegistrationMail(context);

      expect(sendMail).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ to: context.email }));
    });

    it("logs an error if mail sending fails", async () => {
      const error = jest.fn();
      const service = getMailService({ sendMailService: { sendMail: jest.fn().mockRejectedValue("Error") }, logger: { error } });

      await service.sendRegistrationMail(buildContext(UserFactory.build()));

      expect(error).toHaveBeenCalled();
    });
  });

  describe("send password reset mail", () => {
    it("sends a password reset mail", async () => {
      const sendMail = jest.fn();
      const service = getMailService({ sendMailService: { sendMail } });
      const context = buildContext();

      await service.sendPasswordResetMail(context);

      expect(sendMail).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ to: context.email }));
    });

    it("logs an error if mail sending fails", async () => {
      const error = jest.fn();
      const service = getMailService({ sendMailService: { sendMail: jest.fn().mockRejectedValue("Error") }, logger: { error } });

      await service.sendPasswordResetMail(buildContext(UserFactory.build()));

      expect(error).toHaveBeenCalled();
    });
  });

  describe("generate e-mail confirmation link", () => {
    it("creates a confirmation link", async () => {
      const apiUrl = "localhost";
      const token = "a11ytoken";

      const service = getMailService({}, { "api.url": apiUrl });

      const url = await service.generateConfirmationLink(token);
      expect(url).toEqual(expect.stringContaining(apiUrl));
      expect(url).toEqual(expect.stringContaining(`?code=${token}`));
    });
  });

  describe("generate password reset link", () => {
    it("can create a password reset link", async () => {
      const apiUrl = "localhost";
      const token = "a11ytoken";

      const service = getMailService({}, { "api.url": apiUrl, "site.url": apiUrl });

      const url = await service.generatePasswordResetLink(token);
      expect(url).toEqual(expect.stringContaining(apiUrl));
      expect(url).toEqual(expect.stringContaining(`reset-password?token=${token}`));
    });
  });
});
