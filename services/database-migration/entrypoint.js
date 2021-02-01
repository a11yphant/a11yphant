const { spawn } = require("child_process");
const unzipper = require("unzipper");
const aws = require("aws-sdk");

const s3 = new aws.S3();
const dbUrl = process.env.DB_URL;

exports.handler = (event, _, callback) => {
  console.log("Starting migration");

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  const zipStream = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();

  zipStream.pipe(unzipper.Extract({ path: "/tmp/prisma" })).on("finish", () => {
    console.log("Retrieved files from S3");

    const migrate = spawn(`DATABASE_URL=${dbUrl} node_modules/.bin/prisma migrate deploy --preview-feature --schema /tmp/prisma/schema.prisma`);
    migrate.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    migrate.stderr.on("data", (data) => {
      console.log(data.toString());
    });

    migrate.on("exit", (code) => {
      console.log(`Migration finished with status code ${code.toString()}`);

      if (code !== 0) {
        callback(Error("Migration failed"));
        return;
      }

      callback();
    });
  });
};
