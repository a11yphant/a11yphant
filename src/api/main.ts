import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as TypeMetadataStorage from "@nestjs/graphql/dist/schema-builder/storages/type-metadata.storage";
import cookieParser from "cookie-parser";

import { AppModule, FunctionAppModule } from "./app.module";

export function configureApp(app: INestApplication): void {
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
}

export async function bootstrap(): Promise<INestApplication> {
  // We manually rest the type metadata storage for the graphql module before initializtion
  // of the application. This needs to be done because NestJS creates an instance of
  // the storage in the module. This leads to duplicate entries if the application
  // is instantiated multiple times witout the module cache being cleared in between.
  // see: https://github.com/nestjs/graphql/blob/7615c80504f8973934614e57c9304f3f663160ed/packages/graphql/lib/schema-builder/storages/type-metadata.storage.ts#L505
  // @ts-expect-error see above
  TypeMetadataStorage.TypeMetadataStorage = new TypeMetadataStorage.TypeMetadataStorageHost();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  configureApp(app);
  app.enableShutdownHooks();
  await app.init();
  return app;
}

export async function bootstrapFunctionApp(): Promise<INestApplication> {
  const app = await NestFactory.create(FunctionAppModule);
  configureApp(app);
  await app.init();
  return app;
}

if (require.main === module) {
  bootstrap();
}
