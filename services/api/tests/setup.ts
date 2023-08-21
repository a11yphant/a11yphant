import { config } from "dotenv";
import { resolve } from "path";

import { setupDatabase } from "./support/database";

config({ path: resolve(__dirname, "../.env") });

export default async function (): Promise<void> {
  await setupDatabase();
}
