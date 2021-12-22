import { Injectable } from "@nestjs/common";

import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

import { JwtScope } from "./enums/jwt-scope.enum";
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

  generateMailConfirmationToken(userId: string): Promise<string> {
    return this.jwtService.createSignedToken({ scope: JwtScope.EMAIL_CONFIRMATION }, { expiresInSeconds: 86400, subject: userId });
  }
}
