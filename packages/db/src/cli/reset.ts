// pnpm --filter @plotline/db reset: drops the schema and migrates from scratch. Destroys all data.
import { connect } from '../client';
import { resetDatabase } from '../migrations';
import { main } from './args';

void main(async () => {
  const handle = connect();
  try {
    await resetDatabase(handle.db);
    console.log('reset and migrated');
  } finally {
    await handle.close();
  }
});
