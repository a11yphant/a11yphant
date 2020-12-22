import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    port: parseInt(process.env.SUBMISSION_CHECKER_PORT) || 3000,
    host: process.env.SUBMISSION_CHECKER_HOST,
  };
});
