import "module-alias/register";

import { AwsTransportStrategy } from "@a11yphant/nestjs-aws-messaging";
import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { SessionInterceptor } from "./authentication/session.interceptor";

export function configureApp(app: INestApplication): void {
  const sessionInterceptor = app.get<SessionInterceptor>(SessionInterceptor);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(sessionInterceptor);
}

export async function setupMicroservices(app: INestApplication): Promise<void> {
  const configService = app.get<ConfigService>(ConfigService);

  const transportStrategy = new AwsTransportStrategy({
    polling: configService.get<boolean>("messaging.poll-queue"),
    queueUrl: configService.get<string>("messaging.queue-url"),
    region: configService.get<string>("messaging.region"),
    deleteHandled: true,
  });

  await app.connectMicroservice<MicroserviceOptions>({
    strategy: transportStrategy,
  });
}

export async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  configureApp(app);
  await setupMicroservices(app);

  const url = configService.get("api.url");
  const port = configService.get("api.port");

  await app.listen(port);
  await app.startAllMicroservices();
  logger.log(`App listening on ${url}/graphql`, AppModule.name);

  return app;
}

if (require.main === module) {
  bootstrap();
}
