import { registerAs } from '@nestjs/config';

export default registerAs('import-challenges', () => {
  return {
    'challenges-location': process.env.IMPORT_CHALLENGES_CHALLENGES_LOCATION,
    'is-lambda': Boolean(+process.env.IMPORT_CHALLENGES_IS_LAMBDA) || false,
  };
});
