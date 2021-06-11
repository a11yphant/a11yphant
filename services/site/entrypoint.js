/* eslint-disable @typescript-eslint/no-var-requires */
const configure = require("@vendia/serverless-express");
const express = require("express");
const next = require("next");
const { default: getNextJsConfig } = require("next/config");
const { imageOptimizer } = require("next/dist/next-server/server/image-optimizer");
const { defaultImageConfig } = require("next/dist/next-server/server/image-config");
const url = require("url");

const nextServer = next({ dev: false });
const handle = nextServer.getRequestHandler();
let serverless = null;

async function init() {
  await nextServer.prepare();
  const app = express();
  serverless = configure({ app });

  /**
   * We have to prevent NextJS from handling the requests for the
   * builtin image optimizer, to be able to adjust its tmp dir.
   * NextJs not intend to allow configuring the cache dir
   * anytime soon: https://github.com/vercel/next.js/issues/10111
   *
   * Inside AWS Lambdas the tmp directory is the only location where we
   * have write access. We will loose the cached image stored there,
   * but that should not matter since they will be cached by
   * CloudFront anyway.
   */
  app.get(defaultImageConfig.path, (req, res) => {
    return imageOptimizer(nextServer, req, res, url.parse(req.url, true), getNextJsConfig(), "/tmp/next-image");
  });

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(3005);
}

const initializationPromise = init();

exports.handler = async (...args) => {
  await initializationPromise;

  return serverless.handler(...args);
};
