/* eslint-disable @typescript-eslint/no-var-requires */
const configure = require("@vendia/serverless-express");
const express = require("express");
const next = require("next");

const nextServer = next({ dev: false });
const handle = nextServer.getRequestHandler();
let serverless = null;

async function init() {
  await nextServer.prepare();
  const app = express();
  serverless = configure({ app });

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(3001, () => {
    console.log("Server is listening.");
  });
}

const initializationPromise = init();

exports.handler = async (...args) => {
  await initializationPromise;

  return serverless.handler(...args);
};
