import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { APP_CONFIG, type AppConfig } from '../config';
import { devIdentity } from './dev-header.strategy';

/** POST /auth/login: checks the password, then starts a session. */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const ok = (await super.canActivate(context)) as boolean;
    await super.logIn(context.switchToHttp().getRequest());
    return ok;
  }
}

const DevHeaderGuard = AuthGuard('dev-header');

/** A logged-in session, or (only with PLOTLINE_DEV_AUTH=1) the dev auth header or cookie. */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  private readonly devGuard = new DevHeaderGuard();

  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    if (req.isAuthenticated()) return true;
    if (this.config.devAuth && devIdentity(req)) return (await this.devGuard.canActivate(context)) as boolean;
    throw new UnauthorizedException('Log in first');
  }
}
