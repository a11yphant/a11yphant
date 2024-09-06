import { BootstrapConsole } from "nestjs-console";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const consoleBootstrapper = new BootstrapConsole({
    module: AppModule,
    useDecorators: true,
    contextOptions: {
      logger: ["debug", "error", "log", "verbose", "warn"],
    },
  });

  try {
    const app = await consoleBootstrapper.init();
    await app.init();
    await consoleBootstrapper.boot();
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

bootstrap();
