import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as TypeMetadataStorage from "@nestjs/graphql/dist/schema-builder/storages/type-metadata.storage";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

let instance: INestApplication;

export function configureApp(app: INestApplication): void {
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
}

async function bootstrap(): Promise<INestApplication> {
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

export async function getApp(): Promise<INestApplication> {
  if (process.env.NODE_ENV === "production") {
    if (!instance) {
      instance = await bootstrap();
    }
  } else {
    // cache the handler globally so that the app isn't restarted when HMR kicks in
    if (!global.instance) {
      global.instance = await bootstrap();
    }

    instance = global.instance;
  }

  return instance;
}
