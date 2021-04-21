import { registerAs } from "@nestjs/config";

export default registerAs("submission-checker", () => {
  return {
    "renderer-base-url": process.env.SUBMISSION_CHECKER_RENDERER_BASE_URL,
    "webdriver-driver": process.env.SUBMISSION_CHECKER_WEBDRIVER_DRIVER || "local",
    "webdriver-endpoint": process.env.SUBMISSION_CHECKER_WEBDRIVER_ENDPOINT || "http://localhost:4444/wd/hub",
    "webdriver-aws-device-farm-project": process.env.SUBMISSION_CHECKER_AWS_DEVICE_FARM_PROJECT,
  };
});
