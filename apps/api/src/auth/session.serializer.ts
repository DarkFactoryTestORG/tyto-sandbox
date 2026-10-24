import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { toUser } from '../common/views';
import type { AuthUser } from './auth-user';
import { UsersRepository } from './users.repository';

/** The session holds the user id; every request reloads the user. */
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly users: UsersRepository) {
    super();
  }

  serializeUser(user: AuthUser, done: (err: Error | null, id?: string) => void): void {
    done(null, user.id);
  }

  deserializeUser(id: string, done: (err: Error | null, user?: AuthUser | false) => void): void {
    this.users.findById(id).then(
      (user) => done(null, user ? toUser(user) : false),
      (error: Error) => done(error),
    );
  }
}
