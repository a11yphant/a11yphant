import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";

import { JwtScope } from "./enums/jwt-scope.enum";
import { MissingApplicationKeyException } from "./exceptions/missing-application-key.exception";
import { JwtOptions } from "./interfaces/jwt-options.interface";

@Injectable()
export class JwtService {
  constructor(private config: ConfigService) {}
  createSignedToken(content: Record<string, any>, options: JwtOptions): Promise<string> {
    const secret = this.config.get<string>("api.key");
    return new Promise((resolve, reject) => {
      if (!secret) {
        return reject(new MissingApplicationKeyException());
      }

      jwt.sign(content, secret, { issuer: "a11yphant", subject: options.subject, expiresIn: options.expiresInSeconds }, (error, token) => {
        if (error) {
          return reject(error);
        }

        resolve(token);
      });
    });
  }

  decodeToken<T extends Record<string, any>>(token: string): T {
    return jwt.decode(token) as T;
  }

  validateToken(token: string, scope: JwtScope): Promise<boolean> {
    const secret = this.config.get<string>("api.key");
    return new Promise((resolve) => {
      if (this.decodeToken(token)?.scope !== scope) {
        return resolve(false);
      }

      jwt.verify(token, secret, (error) => {
        if (error) {
          return resolve(false);
        }

        return resolve(true);
      });
    });
  }
}
