/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { init, getServerlessHandler } = require("./server");

const initializationPromise = init();

exports.handler = async (...args) => {
  await initializationPromise;

  return getServerlessHandler().handler(...args);
};
