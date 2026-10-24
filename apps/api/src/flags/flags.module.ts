import { Controller, Get, Global, Inject, Injectable, Module, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards';
import { APP_CONFIG, type AppConfig } from '../config';

/** Feature flags, from PLOTLINE_FLAGS. New behaviour ships behind one (e.g. `recurring-tasks`). */
@Injectable()
export class FlagsService {
  private readonly enabled: ReadonlySet<string>;

  constructor(@Inject(APP_CONFIG) config: AppConfig) {
    this.enabled = new Set(config.flags);
  }

  isEnabled(flag: string): boolean {
    return this.enabled.has(flag);
  }

  list(): string[] {
    return [...this.enabled].sort();
  }
}

@Controller('flags')
@UseGuards(AuthenticatedGuard)
export class FlagsController {
  constructor(private readonly flags: FlagsService) {}

  @Get()
  list(): { flags: string[] } {
    return { flags: this.flags.list() };
  }
}

@Global()
@Module({ providers: [FlagsService], controllers: [FlagsController], exports: [FlagsService] })
export class FlagsModule {}
