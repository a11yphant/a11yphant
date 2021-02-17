import './bootstrap/environment';

import { setupDatabase } from '@a11y-challenges/prisma';

export default async function (): Promise<void> {
  await setupDatabase();
}
