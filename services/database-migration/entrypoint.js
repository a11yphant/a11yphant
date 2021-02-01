const { exec } = require("child_process");
const unzipper = require("unzipper");
const s3 = require("aws-sdk").S3();

const migrationsBucket = process.env.S3_MIGRATION_BUCKET;
const migrationZipObjectKey = process.env.S3_MIGRATION_ZIP_OBJECT_KEY;

exports.handler = () => {
  const zipStream = s3.getObject({ Bucket: migrationsBucket, Key: migrationZipObjectKey }).createReadStream();
  zipStream.pipe(unzipper.Extract({ path: "/tmp/prisma" })).on("finish", () => {
    exec("node_modules/.bin/prisma migrate --preview-feature --schema /tmp/prisma/schema.prisma");
  });
};
