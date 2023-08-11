import { registerAs } from "@nestjs/config";

export default registerAs("submission-checker", () => {
  return {
    "renderer-base-url": process.env.SUBMISSION_CHECKER_RENDERER_BASE_URL,
  };
});
