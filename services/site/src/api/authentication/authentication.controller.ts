import { Controller, Get, Logger, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

import { UserService } from "@/user/user.service";

import { FlashMessage } from "./enums/flash-message.enum";
import { JwtScope } from "./enums/jwt-scope.enum";
import { GithubAuthGuard } from "./guards/github.guard";
import { TwitterAuthGuard } from "./guards/twitter.guard";
import { ProviderInformation } from "./interfaces/provider-information.interface";
import type { SessionToken as SessionTokenInterface } from "./interfaces/session-token.interface";
import { JwtService } from "./jwt.service";

@Controller("api/auth")
export class AuthenticationController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private logger: Logger,
    private config: ConfigService,
  ) {}

  @Get("confirm")
  async confirm(@Query("code") token: string, @Res() res: Response): Promise<void> {
    const url = this.config.get<string>("site.url");
    if (!(await this.jwtService.validateToken(token, JwtScope.EMAIL_CONFIRMATION))) {
      return res.redirect(`${url}?fm-type=${FlashMessage.EMAIL_CONFIRMATION_FAILED}`);
    }

    const { sub: userId } = await this.jwtService.decodeToken(token);

    try {
      await this.userService.confirmUser(userId);
    } catch (error) {
      return res.redirect(`${url}?fm-type=${FlashMessage.EMAIL_CONFIRMATION_FAILED}`);
    }

    res.redirect(`${url}?fm-type=${FlashMessage.EMAIL_CONFIRMATION_SUCCESSFUL}`);
  }

  @UseGuards(GithubAuthGuard)
  @Get("github")
  github(): void {
    return;
  }

  @UseGuards(TwitterAuthGuard)
  @Get("twitter")
  twitter(): void {
    return;
  }

  @UseGuards(GithubAuthGuard)
  @Get("github/callback")
  async githubCallback(
    @Req() req: Request & { user: ProviderInformation; sessionToken: SessionTokenInterface },
    @Res() res: Response,
  ): Promise<void> {
    if (req.query?.error === "access_denied") {
      res.redirect(`${this.config.get<string>("site.url")}?fm-type=oauth-login-failed`);
      return;
    }

    await this.createOauthCookie(req, res);
    res.redirect(this.config.get<string>("site.url"));
  }

  @UseGuards(TwitterAuthGuard)
  @Get("twitter/callback")
  async twitterCallback(
    @Req() req: Request & { user: ProviderInformation; sessionToken: SessionTokenInterface },
    @Res() res: Response,
  ): Promise<void> {
    await this.createOauthCookie(req, res);
    res.redirect(this.config.get<string>("site.url"));
  }

  async createOauthCookie(req: Request & { user: ProviderInformation; sessionToken: SessionTokenInterface }, res: Response): Promise<void> {
    // the information we pass to the done() function in the strategy validate method
    // will be in the req.user variable
    const { sessionToken, user: providerInformation } = req;

    if (!sessionToken?.userId) return;

    const foundUser = await this.userService.updateWithAuthInformation(sessionToken?.userId, providerInformation);

    const token = await this.jwtService.createSignedToken({ scope: JwtScope.SESSION }, { subject: foundUser.id, expiresInSeconds: 3600 * 24 * 365 });
    res.cookie(this.config.get<string>("cookie.name"), token, this.config.get("cookie.defaultConfig"));
    this.logger.verbose(`Set session cookie for user ${providerInformation.id} with provider ${providerInformation.provider}`);
  }
}
