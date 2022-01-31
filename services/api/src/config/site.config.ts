import { registerAs } from "@nestjs/config";

export default registerAs("site", () => {
  const port = Number(process.env.SITE_PORT);
  const host = process.env.SITE_HOST || "localhost";

  const url = process.env.NODE_ENV === "development" ? `http://${host}:${port}` : `https://${process.env.API_HOST}`;

  return {
    url,
  };
});
