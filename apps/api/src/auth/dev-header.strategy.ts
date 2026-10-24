import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { DEV_AUTH_COOKIE, DEV_AUTH_HEADER } from '@plotline/shared';
import type { Request } from 'express';
import { Strategy } from 'passport-custom';
import { toUser } from '../common/views';
import type { AuthUser } from './auth-user';
import { UsersRepository } from './users.repository';

/** The email a request names through the dev auth header, or the cookie of the same name. */
export function devIdentity(req: Request): string | undefined {
  const header = req.headers[DEV_AUTH_HEADER];
  if (typeof header === 'string' && header.trim()) return header.trim();
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === DEV_AUTH_COOKIE && rest.length)
      return decodeURIComponent(rest.join('=')).trim() || undefined;
  }
  return undefined;
}

/**
 * The dev auth bypass. Registered only when PLOTLINE_DEV_AUTH=1 (AuthModule), which config.ts
 * refuses in production. Agents, e2e tests and evidence capture act as seeded users with it.
 */
@Injectable()
export class DevHeaderStrategy extends PassportStrategy(Strategy, 'dev-header') {
  constructor(private readonly users: UsersRepository) {
    super();
  }

  async validate(req: Request): Promise<AuthUser> {
    const email = devIdentity(req);
    const user = email ? await this.users.findByEmail(email) : undefined;
    if (!user) throw new UnauthorizedException(`No seeded user with email ${email ?? '(none)'}`);
    return toUser(user);
  }
}
