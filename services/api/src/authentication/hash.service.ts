import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export class HashService {
  make(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  compare(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }
}
