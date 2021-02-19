import { config } from "dotenv";
import { resolve } from "path";

import { setupDatabase } from "../lib/testing/helpers";

config({ path: resolve(__dirname, "../../../../.env") });

export default async function (): Promise<void> {
  await setupDatabase();
}
