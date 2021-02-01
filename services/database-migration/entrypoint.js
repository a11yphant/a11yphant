const { exec } = require("child_process");
const unzipper = require("unzipper");
const aws = require("aws-sdk");

const s3 = new aws.S3();

exports.handler = (_, event, callback) => {
  console.log("Starting migration");

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  const zipStream = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();

  zipStream.pipe(unzipper.Extract({ path: "/tmp/prisma" })).on("finish", () => {
    console.log("Retrieved files from S3");
    exec("node_modules/.bin/prisma migrate --preview-feature --schema /tmp/prisma/schema.prisma");
    console.log("Migration finished");
    callback();
  });
};
