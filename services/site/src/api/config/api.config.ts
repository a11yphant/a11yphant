import { registerAs } from "@nestjs/config";

export default registerAs("api", () => {
  const port = Number(process.env.PORT) || Number(process.env.API_PORT);
  const host = process.env.API_HOST || "localhost";

  const url = process.env.NODE_ENV === "development" ? `http://${host}:${port}` : `https://${host}`;

  return {
    port,
    url,
    "challenges-location": process.env.API_CHALLENGES_LOCATION,
    key: process.env.API_KEY,
    "user-as-stale-days": 7,
    "importer-enabled": Boolean(+process.env.API_CHALLENGE_IMPORTER_ENABLED),
  };
});
