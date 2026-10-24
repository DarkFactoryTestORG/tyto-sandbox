// pnpm --filter @plotline/db migrate: applies pending migrations to DATABASE_URL.
import { connect } from '../client';
import { runMigrations } from '../migrations';
import { main } from './args';

void main(async () => {
  const handle = connect();
  try {
    await runMigrations(handle.db);
    console.log('migrated');
  } finally {
    await handle.close();
  }
});
