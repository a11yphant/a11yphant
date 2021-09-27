import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Request } from "express";

import { JwtService } from "./jwt.service";

@Injectable()
export class StoreService implements OnModuleInit {
  keyMap: Map<string, any>;

  constructor(private jwtService: JwtService, private logger: Logger) {}

  onModuleInit = (): void => {
    this.keyMap = new Map();
  };

  public set = (req: Request, token: string, tokenSecret: string, state: unknown, meta: unknown, cb: () => void): void => {
    this.logger.debug("Store: set called");
    this.keyMap.set(this.getId(req), {
      oauth_token: token,
      oauth_token_secret: tokenSecret,
      state,
    });

    cb();
  };

  public get = (req: Request, token: string, cb: (e: Error, secret: string, state: unknown) => void): void => {
    this.logger.debug("Store: get called");
    const { oauth_token_secret, state } = this.keyMap.get(this.getId(req));
    cb(null, oauth_token_secret, state);
  };

  public destroy = (req: Request, token: string, cb: () => void): void => {
    this.logger.debug("Store: delete called");
    this.keyMap.delete(this.getId(req));
    cb();
  };

  private getId = (req: Request): string => this.jwtService.decodeToken<{ id: string }>(req.cookies["a11yphant_session"]).id;
}
