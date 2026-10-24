import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import bcrypt from 'bcryptjs';
import { Strategy } from 'passport-local';
import { toUser } from '../common/views';
import type { AuthUser } from './auth-user';
import { UsersRepository } from './users.repository';

/** Email and password, checked against the bcrypt hash. */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly users: UsersRepository) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<AuthUser> {
    const user = await this.users.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Wrong email or password');
    }
    return toUser(user);
  }
}
