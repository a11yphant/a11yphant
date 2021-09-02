import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";

import { UserService } from "@/user/user.service";

import { SessionToken as SessionTokenInterface } from "./interfaces/session-token.interface";
import { JwtService } from "./jwt.service";

@Controller("auth")
export class AuthenticationController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @UseGuards(AuthGuard("github"))
  @Get("github")
  github(): void {
    return;
  }

  @UseGuards(AuthGuard("github"))
  @Get("github/callback")
  async githubCallback(
    @Req() req: Request & { user: Record<string, unknown>; sessionToken: SessionTokenInterface },
    @Res() res: Response,
  ): Promise<void> {
    await this.createOauthCookie(req, res, "github");
    res.redirect("/");
  }

  async createOauthCookie(
    req: Request & { user: Record<string, unknown>; sessionToken: SessionTokenInterface },
    res: Response,
    provider: string,
  ): Promise<void> {
    // the information we pass to the done() function in the strategy validate method
    // will be in the req.user variable
    const { sessionToken, user } = req;

    const { id: userId } = await this.userService.findUserFromOauth(sessionToken.userId, provider, user.id as string);

    const token = await this.jwtService.createSignedToken({ userId }, { subject: "session", expiresInSeconds: 3600 * 24 * 365 });
    res.cookie("a11yphant_session", token, { sameSite: "lax", secure: true, httpOnly: true });
  }
}
