import { registerAs } from "@nestjs/config";

export default registerAs("smtp", () => {
  return {
    username: process.env.AWS_ACCESS_KEY_ID,
    password: process.env.AWS_SES_SMTP_PASSWORD,
    endpoint: process.env.AWS_SES_SMTP_ENDPOINT,
    port: process.env.AWS_SES_SMTP_PORT,
  };
});
