import { Controller, Get, Logger, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";

import { UserService } from "@/user/user.service";

import { ProviderInformation } from "./interfaces/provider-information.interface";
import { SessionToken as SessionTokenInterface } from "./interfaces/session-token.interface";
import { JwtService } from "./jwt.service";

@Controller("auth")
export class AuthenticationController {
  constructor(private userService: UserService, private jwtService: JwtService, private logger: Logger, private config: ConfigService) {}

  @Get("confirm")
  async confirm(@Query("code") token: string, @Res() res: Response): Promise<void> {
    if (!(await this.jwtService.validateToken(token))) {
      return res.redirect("/");
    }

    const { sub: userId } = await this.jwtService.decodeToken(token);
    await this.userService.confirmUser(userId);
    res.redirect("/");
  }

  @UseGuards(AuthGuard("github"))
  @Get("github")
  github(): void {
    return;
  }

  @UseGuards(AuthGuard("twitter"))
  @Get("twitter")
  twitter(): void {
    return;
  }

  @UseGuards(AuthGuard("github"))
  @Get("github/callback")
  async githubCallback(
    @Req() req: Request & { user: ProviderInformation; sessionToken: SessionTokenInterface },
    @Res() res: Response,
  ): Promise<void> {
    await this.createOauthCookie(req, res);
    res.redirect("/");
  }

  @UseGuards(AuthGuard("twitter"))
  @Get("twitter/callback")
  async twitterCallback(
    @Req() req: Request & { user: ProviderInformation; sessionToken: SessionTokenInterface },
    @Res() res: Response,
  ): Promise<void> {
    await this.createOauthCookie(req, res);
    res.redirect("/");
  }

  async createOauthCookie(req: Request & { user: ProviderInformation; sessionToken: SessionTokenInterface }, res: Response): Promise<void> {
    // the information we pass to the done() function in the strategy validate method
    // will be in the req.user variable
    const { sessionToken, user: providerInformation } = req;

    if (!sessionToken?.userId) return;

    const foundUser = await this.userService.updateWithAuthInformation(sessionToken?.userId, providerInformation);

    const token = await this.jwtService.createSignedToken({ userId: foundUser.id }, { subject: "session", expiresInSeconds: 3600 * 24 * 365 });
    res.cookie(this.config.get<string>("cookie.name"), token, this.config.get("cookie.defaultConfig"));
    this.logger.verbose(`Set session cookie for user ${providerInformation.id} with provider ${providerInformation.provider}`);
  }
}
