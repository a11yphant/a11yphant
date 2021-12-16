/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const configure = require("@vendia/serverless-express");
const express = require("express");
const next = require("next");
const { imageOptimizer } = require("next/dist/server/image-optimizer");
const { default: loadConfig } = require("next/dist/server/config");
const url = require("url");
const { PHASE_PRODUCTION_SERVER } = require("next/constants");
const { resolve } = require("path");
const proxy = require("express-http-proxy");

let app = null;
let serverless = null;

function getServerlessHandler() {
  return serverless;
}

function getServer() {
  return app;
}

async function init({ dev = false } = {}) {
  console.log("Starting next server");
  const nextServer = next({ dev });
  const handle = nextServer.getRequestHandler();
  await nextServer.prepare();
  console.log("Next server started");
  app = express();
  serverless = configure({ app });

  /**
   * We have to prevent NextJS from handling the requests for the
   * built-in image optimizer, to be able to adjust its cache dir.
   * NextJs does not intend to allow configuring the cache dir
   * anytime soon: https://github.com/vercel/next.js/issues/10111
   *
   * Inside AWS Lambdas the tmp directory is the only location where we
   * have write access. We will loose the cached images stored there,
   * but that should not matter since they will be cached by
   * CloudFront anyway.
   */
  const nextConfig = await loadNextJsConfig();
  app.get("/_next/image", (req, res) => {
    return imageOptimizer(nextServer, req, res, url.parse(req.url, true), nextConfig, "/tmp/next-image");
  });

  if (process.env.SITE_GRAPHQL_ENDPOINT_SERVER) {
    app.use(
      "/graphql",
      proxy(process.env.SITE_GRAPHQL_ENDPOINT_SERVER, {
        proxyReqPathResolver: () => "/graphql",
      }),
    );
  }

  app.get("*", (req, res) => {
    console.log("forwarding request to next server");
    return handle(req, res);
  });
}

async function loadNextJsConfig() {
  const dir = resolve(".");
  const conf = await loadConfig(PHASE_PRODUCTION_SERVER, dir);
  return conf;
}

module.exports = {
  getServer,
  getServerlessHandler,
  init,
};
