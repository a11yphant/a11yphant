/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { init, getServer } = require("./server");

async function bootstrap(config) {
  await init(config);
  const server = getServer();
  const port = process.env.SITE_PORT || 3001;
  const host = process.env.SITE_HOST || "localhost";
  server.listen(port, host);
  console.log(`Server is listening on ${host}:${port}`);
}

if (require.main === module) {
  bootstrap();
}

module.exports = {
  bootstrap,
};
