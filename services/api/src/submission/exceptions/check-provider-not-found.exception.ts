import { RpcException } from "@nestjs/microservices";

export class CheckProviderNotFound extends RpcException {
  constructor(checkKey: string) {
    super(`No check provider for a check with the key ${checkKey} was not found`);
  }
}
