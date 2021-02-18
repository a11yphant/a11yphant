const { exec } = require("child_process");
const { promisify } = require("util");
const { writeFile, createReadStream } = require("fs");
const unzipper = require("unzipper");
const aws = require("aws-sdk");
const execPromise = promisify(exec);
const writeFilePromise = promisify(writeFile);

const s3 = new aws.S3({ httpOptions: { timeout: 3000 } });
const dbUrl = process.env.DB_URL;

exports.handler = async (event) => {
  console.log("Starting migration");

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  console.log(`Loading migrations from S3 (Bucket: ${bucket}, Key: ${key})`);

  try {
    console.log("Downloading zip from S3");
    const { Body } = await s3.getObject({ Bucket: bucket, Key: key }).promise();

    console.log("Writing zip file to tmp location");
    await writeFilePromise("/tmp/prisma.zip", Body);

    console.log("Unzipping migrations");
    const zipStream = createReadStream("/tmp/prisma.zip");
    await zipStream.pipe(unzipper.Extract({ path: "/tmp/prisma" })).promise();

    console.log("Successfully extracted migrations");
  } catch (error) {
    console.log("Retrieving migrations from S3 failed");
    console.log(error);
    return;
  }

  console.log("Retrieved files from S3");

  console.log("Starting the migration process");

  try {
    const { stdout, stderr } = await execPromise(
      `DB_URL=${dbUrl} node_modules/@prisma/cli/build/index.js migrate deploy --preview-feature --schema=/tmp/prisma/schema.prisma`,
    );

    if (stderr) {
      throw stderr;
    }

    console.log(stdout);
    console.log("Migration successful");
  } catch (error) {
    console.log(`Migration failed`);
    console.log(error);
    throw Error("Migration failed");
  }
};
