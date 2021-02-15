import "./bootstrap/environment";

import { setupDatabase } from "./bootstrap/database";

export default async function (): Promise<void> {
  await setupDatabase();
}
