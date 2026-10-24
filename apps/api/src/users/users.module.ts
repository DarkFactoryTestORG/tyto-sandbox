import { Body, Controller, Get, Module, Patch, Query, UseGuards } from '@nestjs/common';
import { type Database, schema } from '@plotline/db';
import { type Task, type UpdateProfileInput, updateProfileSchema, type User } from '@plotline/shared';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { AuthUser } from '../auth/auth-user';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthenticatedGuard } from '../auth/guards';
import { ZodPipe } from '../common/zod.pipe';
import { toUser } from '../common/views';
import { InjectDb } from '../db.module';
import { TasksModule } from '../tasks/tasks.module';
import { TasksService } from '../tasks/tasks.service';

const myTasksQuery = z.object({ workspaceId: z.string().uuid().optional() });

@Controller('me')
@UseGuards(AuthenticatedGuard)
export class MeController {
  constructor(
    @InjectDb() private readonly db: Database,
    private readonly tasks: TasksService,
  ) {}

  @Get()
  me(@CurrentUser() user: AuthUser): User {
    return user;
  }

  @Patch()
  async update(
    @CurrentUser() user: AuthUser,
    @Body(new ZodPipe(updateProfileSchema)) body: UpdateProfileInput,
  ): Promise<User> {
    if (Object.keys(body).length === 0) return user;
    const [row] = await this.db
      .update(schema.users)
      .set(body)
      .where(eq(schema.users.id, user.id))
      .returning();
    return toUser(row!);
  }

  /** My tasks: open tasks assigned to me, soonest due first. */
  @Get('tasks')
  myTasks(
    @CurrentUser() user: AuthUser,
    @Query(new ZodPipe(myTasksQuery)) query: z.infer<typeof myTasksQuery>,
  ): Promise<Task[]> {
    return this.tasks.assignedTo(user, query.workspaceId);
  }
}

@Module({ imports: [TasksModule], controllers: [MeController] })
export class UsersModule {}
