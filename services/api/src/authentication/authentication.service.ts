import { Injectable } from "@nestjs/common";

import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

import { JwtScope } from "./enums/jwt-scope.enum";
import { InvalidJwtException } from "./exceptions/invalid-jwt.exception";
import { UserNotFoundException } from "./exceptions/user-not-found.exception";
import { HashService } from "./hash.service";
import { LoginInput } from "./inputs/login.input";
import { JwtService } from "./jwt.service";

@Injectable()
export class AuthenticationService {
  constructor(private userService: UserService, private hashService: HashService, private jwtService: JwtService) {}

  async login({ email, password }: LoginInput): Promise<User> {
    const msg = "E-Mail or password wrong.";

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Error(msg);
    }

    if (!user.verifiedAt) {
      throw new Error("E-Mail address has not yet been verified.");
    }

    const passwordOk = await this.hashService.compare(password, user.password);

    if (!passwordOk) {
      throw new Error(msg);
    }

    return user;
  }

  async validatePasswordResetToken(token: string): Promise<boolean> {
    const validJwt = await this.jwtService.validateToken(token);

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

  generateMailConfirmationToken(userId: string): Promise<string> {
    return this.jwtService.createSignedToken({ scope: JwtScope.EMAIL_CONFIRMATION }, { expiresInSeconds: 86400, subject: userId });
  }
}
