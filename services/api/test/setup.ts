import { setupDatabase } from "@a11y-challenges/prisma";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

export default async function (): Promise<void> {
  await setupDatabase();
}
