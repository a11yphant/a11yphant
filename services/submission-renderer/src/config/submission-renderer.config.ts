import { registerAs } from "@nestjs/config";

export default registerAs("submission-renderer", () => {
  return {
    port: parseInt(process.env.SUBMISSION_RENDERER_PORT) || 3000,
    lambda: Boolean(+process.env.SUBMISSION_RENDERER_LAMBDA) || false,
  };
});
