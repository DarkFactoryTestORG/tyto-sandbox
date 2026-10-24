import { type DynamicModule, Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import type { AppConfig } from '../config';
import { AuthController } from './auth.controller';
import { DevHeaderStrategy } from './dev-header.strategy';
import { AuthenticatedGuard, LocalAuthGuard } from './guards';
import { LocalStrategy } from './local.strategy';
import { RolesGuard } from './roles';
import { SessionSerializer } from './session.serializer';
import { UsersRepository } from './users.repository';

@Global()
@Module({})
export class AuthModule {
  static register(config: AppConfig): DynamicModule {
    return {
      module: AuthModule,
      imports: [PassportModule.register({ session: true })],
      controllers: [AuthController],
      providers: [
        UsersRepository,
        LocalStrategy,
        SessionSerializer,
        LocalAuthGuard,
        AuthenticatedGuard,
        RolesGuard,
        // The bypass strategy exists only when it is switched on.
        ...(config.devAuth ? [DevHeaderStrategy] : []),
      ],
      exports: [UsersRepository, AuthenticatedGuard, RolesGuard],
    };
  }
}
