import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";

import { MissingApplicationKeyException } from "./excpetions/missing-application-key.exception";
import { JwtOptions } from "./jwt-options.interface";

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

  validateToken(token: string): Promise<boolean> {
    const secret = this.config.get<string>("api.key");
    return new Promise((resolve) => {
      jwt.verify(token, secret, (error) => {
        if (error) {
          return resolve(false);
        }

        return resolve(true);
      });
    });
  }
}
