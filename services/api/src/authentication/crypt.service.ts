import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export class CryptService {
  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  comparePassword(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }
}
