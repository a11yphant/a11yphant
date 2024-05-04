import { registerAs } from "@nestjs/config";

export default registerAs("database", () => {
  return {
    url: process.env.DB_PRISMA_URL || process.env.DB_URL || process.env.DATABASE_URL,
  };
});
