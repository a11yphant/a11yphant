/**
 * The AWS Lambda entrypoint has to be in the root directory for the function. Hence this
 * file is necessary to to forward the handler for the lambda to the dist directory.
 */

// eslint-disable-next-line
const { handle } = require("./dist/main.js");

exports.handle = handle;
