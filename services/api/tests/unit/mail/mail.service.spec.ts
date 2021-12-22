import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import { createConfigServiceMock } from "@tests/support/helpers";

import { AuthenticationService } from "@/authentication/authentication.service";
import { MailService } from "@/mail/mail.service";
import { User } from "@/user/models/user.model";

const getMailService = (
  partials: { mailerService?: Partial<MailerService>; authService?: Partial<AuthenticationService>; logger?: Partial<Logger> } = {},
  configData?: Record<string, any>,
): MailService => {
  const mailerService = createMock<MailerService>(partials?.mailerService);
  const config = createMock<ConfigService>(createConfigServiceMock(configData));
  const authService = createMock<AuthenticationService>(partials?.authService);
  const logger = createMock<Logger>(partials?.logger);

  return new MailService(mailerService, config, authService, logger);
};

describe("mailService", () => {
  describe("sendMail", () => {
    it("sends a registration mail", async () => {
      const sendMail = jest.fn();

      const service = getMailService({ mailerService: { sendMail } });
      service.generateConfirmationLink = (user: User): Promise<string> => Promise.resolve("link");

      const user = UserFactory.build();

      await service.sendRegistrationMail(user);
      expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: user.email }));
    });

    it("logs an error if mail sending fails", async () => {
      const error = jest.fn();
      const service = getMailService({ mailerService: { sendMail: jest.fn().mockRejectedValue("Error") }, logger: { error } });
      service.generateConfirmationLink = (user: User): Promise<string> => Promise.resolve("link");

      await service.sendRegistrationMail(UserFactory.build());

      expect(error).toHaveBeenCalled();
    });
  });

  describe("generateConfirmationLink", () => {
    it("creates a confirmation link", async () => {
      const apiUrl = "localhost";
      const token = "a11ytoken";

      const service = getMailService({ authService: { generateMailConfirmationToken: jest.fn().mockResolvedValue(token) } }, { "api.url": apiUrl });
      const user = UserFactory.build();

      const url = await service.generateConfirmationLink(user);
      expect(url).toEqual(expect.stringContaining(apiUrl));
      expect(url).toEqual(expect.stringContaining(`?code=${token}`));
    });
  });
});
