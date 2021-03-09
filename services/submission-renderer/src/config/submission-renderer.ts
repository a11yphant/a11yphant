import { registerAs } from '@nestjs/config';

export default registerAs('submissionRenderer', () => {
  return {
    baseUrl: process.env.SUBMISSION_CHECKER_RESULT_RENDERER_BASE_URL,
  };
});
