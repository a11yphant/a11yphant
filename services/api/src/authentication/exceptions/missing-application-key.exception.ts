import { HttpException } from "@nestjs/common";

export class MissingApplicationKeyException extends HttpException {
  constructor() {
    super("Missing application secret key", 500);
  }
}
