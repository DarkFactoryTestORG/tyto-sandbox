import {
  BadRequestException,
  Controller,
  Get,
  Injectable,
  Module,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { type Database, schema } from '@plotline/db';
import { type ActivityPage, type ActivityQuery, activityQuerySchema } from '@plotline/shared';
import { and, desc, eq, sql, type SQL } from 'drizzle-orm';
import { AuthenticatedGuard } from '../auth/guards';
import { Roles, RolesGuard } from '../auth/roles';
import { decodeCursor, encodeCursor } from '../common/cursor';
import { ZodPipe } from '../common/zod.pipe';
import { InjectDb } from '../db.module';

export const ACTIVITY_PAGE_SIZE = 30;
const { activityEvents } = schema;

@Injectable()
export class ActivityService {
  constructor(@InjectDb() private readonly db: Database) {}

  /** Newest first, keyset-paged by (at, id). */
  async page(workspaceId: string, query: ActivityQuery): Promise<ActivityPage> {
    const filters: SQL[] = [eq(activityEvents.workspaceId, workspaceId)];
    if (query.actorId) filters.push(eq(activityEvents.actorId, query.actorId));
    if (query.cursor) {
      const after = decodeCursor(query.cursor);
      if (!after) throw new BadRequestException('Invalid cursor');
      filters.push(
        sql`(${activityEvents.at}, ${activityEvents.id}) < (${after.at}::timestamptz, ${after.id}::uuid)`,
      );
    }
    const rows = await this.db
      .select()
      .from(activityEvents)
      .where(and(...filters))
      .orderBy(desc(activityEvents.at), desc(activityEvents.id))
      .limit(ACTIVITY_PAGE_SIZE + 1);
    const page = rows.slice(0, ACTIVITY_PAGE_SIZE);
    const last = page.at(-1);
    return {
      events: page.map((e) => ({
        id: e.id,
        kind: e.kind,
        actorId: e.actorId,
        taskId: e.taskId,
        at: e.at.toISOString(),
      })),
      nextCursor:
        rows.length > ACTIVITY_PAGE_SIZE && last
          ? encodeCursor({ at: last.at.toISOString(), id: last.id })
          : null,
    };
  }
}

@Controller('workspaces/:workspaceId/activity')
@UseGuards(AuthenticatedGuard, RolesGuard)
export class ActivityController {
  constructor(private readonly activity: ActivityService) {}

  @Get()
  @Roles('viewer')
  page(
    @Param('workspaceId') workspaceId: string,
    @Query(new ZodPipe(activityQuerySchema)) query: ActivityQuery,
  ): Promise<ActivityPage> {
    return this.activity.page(workspaceId, query);
  }
}

@Module({ controllers: [ActivityController], providers: [ActivityService] })
export class ActivityModule {}
