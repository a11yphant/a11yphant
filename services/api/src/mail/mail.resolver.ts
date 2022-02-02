import { Mutation, Resolver } from "@nestjs/graphql";

import { AuthenticationService } from "@/authentication/authentication.service";
import { SessionToken as SessionTokenInterface } from "@/authentication/interfaces/session-token.interface";
import { SessionToken } from "@/authentication/session-token.decorator";
import { MailService } from "@/mail/mail.service";
import { UserService } from "@/user/user.service";

@Resolver()
export class MailResolver {
  constructor(private userService: UserService, private authService: AuthenticationService, private mailService: MailService) {}

  @Mutation(() => Boolean, { description: "Resend the confirmation email." })
  async resendConfirmationEmail(@SessionToken() sessionToken: SessionTokenInterface): Promise<boolean> {
    const user = await this.userService.findById(sessionToken.userId);

    this.mailService.sendRegistrationMail({
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      token: await this.authService.generateMailConfirmationToken(user.id),
    });

    return true;
  }
}
