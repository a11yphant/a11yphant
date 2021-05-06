require("dotenv").config();

const existingCommands = ["start", "dev", "build", "telemetry"];
const errorMessage =
    "No or wrong command. Options: start | dev | build | telemetry";

if (!(process.argv.length >= 3)) {
    throw new Error(errorMessage);
}

const [, , command, ...args] = process.argv;
const port = process.env.SITE_PORT || 3001;
const host = process.env.SITE_HOST || "localhost";

if (!existingCommands.includes(command)) {
    throw new Error(errorMessage);
}

let cli;
switch (command) {
    case "start":
        cli = require("next/dist/cli/next-start");
        cli.nextStart(["-p", port, "-H", host, ...args]);
        break;
    case "dev":
        cli = require("next/dist/cli/next-dev");
        cli.nextDev(["-p", port, "-H", host, ...args]);
        break;
}
