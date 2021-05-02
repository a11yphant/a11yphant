import { RpcException } from "@nestjs/microservices";

export class WebdriverDriverNotSupportedException extends RpcException {
  constructor(driver: string) {
    super(`The selected webdriver driver ${driver} is currently not supported.`);
  }
}
