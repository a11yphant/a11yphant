/**
 * @jest-environment node
 */

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

import { JwtService } from "./jwt.service";

interface TokenInformation {
  oauth_token: string;
  oauth_token_secret: string;
  state: unknown;
}

@Injectable()
export class StoreService {
  private tokenMap = new Map<string, TokenInformation>();

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  public set(req: Request, token: string, tokenSecret: string, state: unknown, meta: unknown, cb: () => void): void {
    this.tokenMap.set(this.getId(req), {
      oauth_token: token,
      oauth_token_secret: tokenSecret,
      state,
    });

    cb();
  }

  public get(req: Request, token: string, cb: (e: Error, secret?: string, state?: unknown) => void): void {
    try {
      const { oauth_token_secret, state } = this.tokenMap.get(this.getId(req));
      cb(null, oauth_token_secret, state);
    } catch (e) {
      cb(e);
    }
  }

  public destroy(req: Request, token: string, cb: () => void): void {
    this.tokenMap.delete(this.getId(req));
    cb();
  }

  private getId(req: Request): string {
    return this.jwtService.decodeToken<{ id: string }>(req.cookies[this.config.get<string>("cookie.name")]).id;
  }
}
