import { registerAs } from "@nestjs/config";

export default registerAs("node", () => ({
  env: process.env.NODE_ENV || "production",
}));
