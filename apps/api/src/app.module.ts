import { type DynamicModule, Global, Module } from '@nestjs/common';
import { ActivityModule } from './activity/activity.module';
import { AuthModule } from './auth/auth.module';
import { BillingModule } from './billing/billing.module';
import { APP_CONFIG, type AppConfig } from './config';
import { DbModule } from './db.module';
import { FlagsModule } from './flags/flags.module';
import { HealthController } from './health.controller';
import { InvitesModule } from './invites/invites.module';
import { ProjectsModule } from './projects/projects.module';
import { SlackModule } from './slack/slack.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Global()
@Module({})
class ConfigModule {
  static register(config: AppConfig): DynamicModule {
    return {
      module: ConfigModule,
      providers: [{ provide: APP_CONFIG, useValue: config }],
      exports: [APP_CONFIG],
    };
  }
}

@Module({})
export class AppModule {
  static register(config: AppConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.register(config),
        DbModule,
        AuthModule.register(config),
        FlagsModule,
        UsersModule,
        WorkspacesModule,
        InvitesModule,
        ProjectsModule,
        TasksModule,
        ActivityModule,
        BillingModule,
        SlackModule,
      ],
      controllers: [HealthController],
    };
  }
}
