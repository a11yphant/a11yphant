import { Controller, Get, HttpException } from "@nestjs/common";

@Controller("*")
export class AppController {
  @Get("hi")
  findAll(): object {
    return { content: "Hi from nestjs" };
  }

  @Get("error")
  error(): never {
    throw new HttpException("Ooops.", 500);
  }
}
