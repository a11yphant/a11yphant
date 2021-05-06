import { registerAs } from "@nestjs/config";

export default registerAs("submission-checker", () => {
  return {
    "renderer-base-url": process.env.SUBMISSION_CHECKER_RENDERER_BASE_URL,
    "webdriver-driver": process.env.SUBMISSION_CHECKER_WEBDRIVER_DRIVER || "remote",
    "webdriver-endpoint": process.env.SUBMISSION_CHECKER_WEBDRIVER_ENDPOINT || "http://localhost:4444/wd/hub",
  };
});
