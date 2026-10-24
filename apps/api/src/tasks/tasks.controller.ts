import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  type Comment,
  type CreateCommentInput,
  createCommentSchema,
  type CreateTaskInput,
  createTaskSchema,
  type Task,
  type TaskListPage,
  type TaskListQuery,
  taskListQuerySchema,
  type UpdateTaskInput,
  updateTaskSchema,
} from '@plotline/shared';
import type { AuthUser } from '../auth/auth-user';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthenticatedGuard } from '../auth/guards';
import { ZodPipe } from '../common/zod.pipe';
import { TasksService } from './tasks.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get('projects/:projectId/tasks')
  list(
    @CurrentUser() user: AuthUser,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query(new ZodPipe(taskListQuerySchema)) query: TaskListQuery,
  ): Promise<TaskListPage> {
    return this.tasks.list(user, projectId, query);
  }

  @Post('projects/:projectId/tasks')
  create(
    @CurrentUser() user: AuthUser,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body(new ZodPipe(createTaskSchema)) body: Required<CreateTaskInput>,
  ): Promise<Task> {
    return this.tasks.create(user, projectId, body);
  }

  @Get('tasks/:taskId')
  get(@CurrentUser() user: AuthUser, @Param('taskId', ParseUUIDPipe) taskId: string): Promise<Task> {
    return this.tasks.get(user, taskId);
  }

  @Patch('tasks/:taskId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body(new ZodPipe(updateTaskSchema)) body: UpdateTaskInput,
  ): Promise<Task> {
    return this.tasks.update(user, taskId, body);
  }

  @Post('tasks/:taskId/complete')
  @HttpCode(200)
  complete(@CurrentUser() user: AuthUser, @Param('taskId', ParseUUIDPipe) taskId: string): Promise<Task> {
    return this.tasks.complete(user, taskId);
  }

  @Post('tasks/:taskId/reopen')
  @HttpCode(200)
  reopen(@CurrentUser() user: AuthUser, @Param('taskId', ParseUUIDPipe) taskId: string): Promise<Task> {
    return this.tasks.reopen(user, taskId);
  }

  @Delete('tasks/:taskId')
  @HttpCode(204)
  remove(@CurrentUser() user: AuthUser, @Param('taskId', ParseUUIDPipe) taskId: string): Promise<void> {
    return this.tasks.remove(user, taskId);
  }

  @Get('tasks/:taskId/comments')
  comments(
    @CurrentUser() user: AuthUser,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ): Promise<Comment[]> {
    return this.tasks.comments(user, taskId);
  }

  @Post('tasks/:taskId/comments')
  addComment(
    @CurrentUser() user: AuthUser,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body(new ZodPipe(createCommentSchema)) body: CreateCommentInput,
  ): Promise<Comment> {
    return this.tasks.addComment(user, taskId, body.body);
  }
}
