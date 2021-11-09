import { registerAs } from "@nestjs/config";

export default registerAs("api", () => {
  const port = Number(process.env.PORT) || Number(process.env.API_PORT);
  const host = process.env.API_HOST || "localhost";

  return {
    port: port,
    url: `http://${host}:${port}`,
    "challenges-location": process.env.API_CHALLENGES_LOCATION,
    key: process.env.API_KEY,
  };
});
