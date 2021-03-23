import { registerAs } from '@nestjs/config';

export default registerAs('import-challenges', () => {
  return {
    'challenges-location': process.env.IMPORT_CHALLENGES_CHALLENGES_LOCATION,
    'is-lambda': Boolean(+process.env.IMPORT_CHALLENGES_IS_LAMBDA) || false,
    's3-bucket': process.env.IMPORT_CHALLENGES_S3_BUCKET,
    's3-object-key': process.env.IMPORT_CHALLENGES_S3_OBJECT_KEY,
  };
});
