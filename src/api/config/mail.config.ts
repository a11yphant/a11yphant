import { registerAs } from "@nestjs/config";

export default registerAs("mail", () => {
  return {
    provider: process.env.API_MAIL_PROVIDER || "smtp",
    smtp: {
      username: process.env.API_SMTP_USER || process.env.AWS_ACCESS_KEY_ID,
      password: process.env.API_SMTP_PASS || process.env.AWS_SES_SMTP_PASSWORD,
      endpoint: process.env.API_SMTP_ENDPOINT || process.env.AWS_SES_SMTP_ENDPOINT,
      port: process.env.API_SMTP_PORT || process.env.AWS_SES_SMTP_PORT,
    },
    from: `a11yphant <no-reply@${process.env.API_MAIL_DOMAIN || process.env.API_HOST}>`,
  };
});
