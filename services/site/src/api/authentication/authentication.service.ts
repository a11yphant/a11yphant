import { Injectable } from "@nestjs/common";

import { ResendEmailConfirmationResultEnum } from "@/authentication/enums/resend-email-confirmation-result.enum";
import { MailService } from "@/mail/mail.service";
import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

import { JwtScope } from "./enums/jwt-scope.enum";
import { InvalidJwtException } from "./exceptions/invalid-jwt.exception";
import { UserNotFoundException } from "./exceptions/user-not-found.exception";
import { LoginInput } from "./graphql/inputs/login.input";
import { HashService } from "./hash.service";
import { JwtService } from "./jwt.service";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login({ email, password }: LoginInput): Promise<User> {
    const msg = "E-Mail or password wrong.";

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Error(msg);
    }

    const passwordOk = await this.hashService.compare(password, user.password);

    if (!passwordOk) {
      throw new Error(msg);
    }

    return user;
  }

  async validatePasswordResetToken(token: string): Promise<boolean> {
    const validJwt = await this.jwtService.validateToken(token, JwtScope.PASSWORD_RESET);

    if (!validJwt) {
      throw new InvalidJwtException();
    }

    const decoded = this.jwtService.decodeToken(token);

    const user = await this.userService.findById(decoded.sub);
    if (!user) {
      throw new UserNotFoundException();
    }

    return true;
  }

  async resetPassword(token: string, password: string): Promise<string> {
    try {
      await this.validatePasswordResetToken(token);
    } catch {
      throw new InvalidJwtException();
    }

    const decodedToken = this.jwtService.decodeToken(token);
    this.userService.updatePassword(decodedToken.sub, password);

    return decodedToken.sub;
  }

  async resendConfirmationEmail(userId: string): Promise<ResendEmailConfirmationResultEnum> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.verifiedAt) {
      return ResendEmailConfirmationResultEnum.ALREADY_VERIFIED;
    }
    if (user.authProvider !== "local" || user.email === undefined) {
      return ResendEmailConfirmationResultEnum.NOT_APPLICABLE;
    }

    this.mailService.sendRegistrationMail({
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      token: await this.generateMailConfirmationToken(user.id),
    });

    return ResendEmailConfirmationResultEnum.SUCCESSFUL;
  }

  generateMailConfirmationToken(userId: string): Promise<string> {
    return this.jwtService.createSignedToken({ scope: JwtScope.EMAIL_CONFIRMATION }, { expiresInSeconds: 86400, subject: userId });
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return;
    }

    this.mailService.sendPasswordResetMail({
      email: user.email,
      token: await this.generatePasswordResetToken(user.id),
    });
  }

  generatePasswordResetToken(userId: string): Promise<string> {
    return this.jwtService.createSignedToken({ scope: JwtScope.PASSWORD_RESET }, { expiresInSeconds: 86400, subject: userId });
  }
}
