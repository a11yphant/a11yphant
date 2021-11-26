/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { init, getServer } = require("./server");

const initializationPromise = init();

async function bootstrap() {
  await initializationPromise;
  const server = getServer();
  server.listen(process.env.SITE_PORT);
  console.log(`Server is listening on port ${process.env.SITE_PORT}`);
}

bootstrap();
