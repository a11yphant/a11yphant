import { Injectable } from "@nestjs/common";

import { User } from "@/user/models/user.model";
import { UserService } from "@/user/user.service";

import { HashService } from "./hash.service";
import { LoginInput } from "./inputs/login.input";

@Injectable()
export class AuthenticationService {
  constructor(private userService: UserService, private hashService: HashService) {}

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
}
