import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const url = configService.get("api.url");
  const port = configService.get("api.port");

  await app.listen(port);
  console.log(`App listening on ${url}/graphql`);
}
bootstrap();

console.log("a change");
