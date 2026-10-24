import { Controller, Get, Injectable, Module, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { type Database, schema } from '@plotline/db';
import type { BillingSummary } from '@plotline/shared';
import { count, eq } from 'drizzle-orm';
import { AuthenticatedGuard } from '../auth/guards';
import { Roles, RolesGuard } from '../auth/roles';
import { InjectDb } from '../db.module';
import { cycleContaining, cyclePriceCents } from './proration';

@Injectable()
export class BillingService {
  constructor(@InjectDb() private readonly db: Database) {}

  /** Paid seats: one per membership. */
  async seatCount(workspaceId: string): Promise<number> {
    const [row] = await this.db
      .select({ n: count() })
      .from(schema.memberships)
      .where(eq(schema.memberships.workspaceId, workspaceId));
    return row?.n ?? 0;
  }

  async summary(workspaceId: string, today = new Date()): Promise<BillingSummary> {
    const w = await this.db.query.workspaces.findFirst({ where: eq(schema.workspaces.id, workspaceId) });
    if (!w) throw new NotFoundException('Workspace not found');
    const seats = await this.seatCount(workspaceId);
    const cycle = cycleContaining(w.billingAnchor, w.plan, today.toISOString().slice(0, 10));
    return {
      plan: w.plan,
      seats,
      seatPriceCents: w.seatPriceCents,
      cycleStart: cycle.start,
      cycleEnd: cycle.end,
      totalCents: seats * cyclePriceCents(w.plan, w.seatPriceCents),
    };
  }
}

@Controller('workspaces/:workspaceId/billing')
@UseGuards(AuthenticatedGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get()
  @Roles('admin')
  summary(@Param('workspaceId') workspaceId: string): Promise<BillingSummary> {
    return this.billing.summary(workspaceId);
  }
}

@Module({ controllers: [BillingController], providers: [BillingService], exports: [BillingService] })
export class BillingModule {}
