/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

require("dotenv").config();

const existingCommands = ["start", "dev"];
const errorMessage = "No or wrong command. Options: start | dev";

if (!(process.argv.length >= 3)) {
  throw new Error(errorMessage);
}

const [, , command] = process.argv;

if (!existingCommands.includes(command)) {
  throw new Error(errorMessage);
}

const { bootstrap } = require("./entrypoint-server");
switch (command) {
  case "start":
    bootstrap({ dev: false });
    break;
  case "dev":
    bootstrap({ dev: true });
    break;
}
