import { registerAs } from '@nestjs/config';

export default registerAs('import-challenges', () => {
  return {
    'challenges-location': process.env.IMPORT_CHALLENGES_CHALLENGES_LOCATION,
  };
});
