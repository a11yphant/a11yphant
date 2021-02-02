/* eslint-disable @typescript-eslint/no-var-requires */
const configure = require("@vendia/serverless-express");
const express = require("express");
const next = require("next");

const nextServer = next({ dev: false });
const handle = nextServer.getRequestHandler();
let app = null;

async function init() {
  await nextServer.prepare();
  app = express();

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(3001, () => {
    console.log("Server is listening.");
  });
}

const initializationPromise = init();

exports.handler = async (event, context, callback) => {
  await initializationPromise;
  const serverless = configure({ app });
  return serverless.proxy({ event, context, callback });
};
