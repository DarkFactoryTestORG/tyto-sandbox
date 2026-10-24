import { Global, Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { connect, type Database, type DbHandle } from '@plotline/db';
import { APP_CONFIG, type AppConfig } from './config';

export const DB_HANDLE = Symbol('DB_HANDLE');
export const DB = Symbol('DB');

/** `@InjectDb() db: Database` in any provider. */
export const InjectDb = () => Inject(DB);

@Global()
@Module({
  providers: [
    {
      provide: DB_HANDLE,
      useFactory: (config: AppConfig) => connect(config.databaseUrl),
      inject: [APP_CONFIG],
    },
    { provide: DB, useFactory: (handle: DbHandle): Database => handle.db, inject: [DB_HANDLE] },
  ],
  exports: [DB_HANDLE, DB],
})
export class DbModule implements OnApplicationShutdown {
  constructor(@Inject(DB_HANDLE) private readonly handle: DbHandle) {}

  async onApplicationShutdown(): Promise<void> {
    await this.handle.close();
  }
}
