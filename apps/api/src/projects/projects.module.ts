import { Body, Controller, Get, Module, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { type CreateProjectInput, createProjectSchema, type Project } from '@plotline/shared';
import type { AuthUser } from '../auth/auth-user';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthenticatedGuard } from '../auth/guards';
import { ZodPipe } from '../common/zod.pipe';
import { ProjectsService } from './projects.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get('workspaces/:workspaceId/projects')
  list(
    @CurrentUser() user: AuthUser,
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
  ): Promise<Project[]> {
    return this.projects.list(user, workspaceId);
  }

  @Post('workspaces/:workspaceId/projects')
  create(
    @CurrentUser() user: AuthUser,
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Body(new ZodPipe(createProjectSchema)) body: Required<CreateProjectInput>,
  ): Promise<Project> {
    return this.projects.create(user, workspaceId, body);
  }

  @Get('workspaces/:workspaceId/projects/by-slug/:slug')
  bySlug(
    @CurrentUser() user: AuthUser,
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('slug') slug: string,
  ): Promise<Project> {
    return this.projects.bySlug(user, workspaceId, slug);
  }

  @Get('projects/:projectId')
  get(@CurrentUser() user: AuthUser, @Param('projectId', ParseUUIDPipe) projectId: string): Promise<Project> {
    return this.projects.get(user, projectId);
  }
}

@Module({ controllers: [ProjectsController], providers: [ProjectsService], exports: [ProjectsService] })
export class ProjectsModule {}
