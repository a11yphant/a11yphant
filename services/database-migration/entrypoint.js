const { exec } = require("child_process");
const { promisify } = require("util");
const { writeFile, createReadStream } = require("fs");
const unzipper = require("unzipper");
const aws = require("aws-sdk");
const execPromise = promisify(exec);
const writeFilePromise = promisify(writeFile);

const s3 = new aws.S3({ httpOptions: { timeout: 3000 } });
const dbUrl = process.env.DB_URL;
const bucket = process.env.S3_BUCKET;
const key = process.env.S3_KEY;

exports.handler = async () => {
  console.log("Starting migration");
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
      `node_modules/prisma/build/index.js migrate deploy --preview-feature --schema=/tmp/prisma/schema.prisma`,
      {
        env: {
          DB_URL: dbUrl,
          PATH: process.env.PATH,
          NODE_ENV: process.env.NODE_ENV,
        },
      },
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
