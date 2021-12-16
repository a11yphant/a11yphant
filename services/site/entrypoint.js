/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { init, getServerlessHandler } = require("./server");

const initializationPromise = init();

exports.handler = async (...args) => {
  console.log("Received event");
  console.log("Waiting for server initialization");
  await initializationPromise;
  console.log("Server initialized");

  return getServerlessHandler().handler(...args);
};
