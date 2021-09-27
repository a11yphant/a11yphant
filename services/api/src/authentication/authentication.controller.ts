import { Controller, Get, Logger, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";

import { UserService } from "@/user/user.service";

import { ProviderInformation } from "./interfaces/providerInformation.interface";
import { SessionToken as SessionTokenInterface } from "./interfaces/session-token.interface";
import { JwtService } from "./jwt.service";

@Controller("auth")
export class AuthenticationController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly logger: Logger) {}

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

    const foundUser = await this.userService.updateWithAuthInformation(sessionToken?.userId, providerInformation);

    if (!foundUser) return;

    const token = await this.jwtService.createSignedToken({ userId: foundUser.id }, { subject: "session", expiresInSeconds: 3600 * 24 * 365 });
    res.cookie("a11yphant_session", token, { sameSite: "lax", secure: true, httpOnly: true });
    this.logger.verbose(`Set session cookie for user ${providerInformation.id} with provider ${providerInformation.provider}`);
  }
}
