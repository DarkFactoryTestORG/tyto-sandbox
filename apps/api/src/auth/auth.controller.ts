import { Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import type { User } from '@plotline/shared';
import type { Request } from 'express';
import type { AuthUser } from './auth-user';
import { CurrentUser } from './current-user.decorator';
import { AuthenticatedGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  login(@CurrentUser() user: AuthUser): User {
    return user;
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request): Promise<void> {
    await new Promise<void>((resolve, reject) => req.logout((err) => (err ? reject(err) : resolve())));
    await new Promise<void>((resolve) => req.session.destroy(() => resolve()));
  }

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  me(@CurrentUser() user: AuthUser): User {
    return user;
  }
}
