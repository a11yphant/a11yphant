const { download } = require("@prisma/fetch-engine");
const { enginesVersion } = require("@prisma/engines-version");
const { join } = require("path");

const runtimePath = join(__dirname, "../client");

download({
  binaries: {
    "query-engine": runtimePath,
  },
  showProgress: true,
  ignoreCache: true,
  version: enginesVersion,
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
