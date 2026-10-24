import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  type Label,
  type Member,
  type UpdateMemberInput,
  updateMemberSchema,
  type Workspace,
} from '@plotline/shared';
import type { AuthUser } from '../auth/auth-user';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthenticatedGuard } from '../auth/guards';
import { type RequestWithMembership, Roles, RolesGuard } from '../auth/roles';
import { ZodPipe } from '../common/zod.pipe';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
@UseGuards(AuthenticatedGuard, RolesGuard)
export class WorkspacesController {
  constructor(private readonly workspaces: WorkspacesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser): Promise<Workspace[]> {
    return this.workspaces.listMine(user);
  }

  @Get('by-slug/:slug')
  bySlug(@CurrentUser() user: AuthUser, @Param('slug') slug: string): Promise<Workspace> {
    return this.workspaces.bySlug(user, slug);
  }

  @Get(':workspaceId')
  @Roles('viewer')
  get(@Param('workspaceId') workspaceId: string, @Req() req: RequestWithMembership): Promise<Workspace> {
    return this.workspaces.get(workspaceId, req.membership!.role);
  }

  @Get(':workspaceId/members')
  @Roles('viewer')
  members(@Param('workspaceId') workspaceId: string): Promise<Member[]> {
    return this.workspaces.members(workspaceId);
  }

  @Patch(':workspaceId/members/:membershipId')
  @Roles('admin')
  updateMember(
    @Param('workspaceId') workspaceId: string,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
    @Body(new ZodPipe(updateMemberSchema)) body: UpdateMemberInput,
  ): Promise<Member> {
    return this.workspaces.updateMember(workspaceId, membershipId, body);
  }

  @Delete(':workspaceId/members/:membershipId')
  @Roles('admin')
  @HttpCode(204)
  removeMember(
    @Param('workspaceId') workspaceId: string,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
  ): Promise<void> {
    return this.workspaces.removeMember(workspaceId, membershipId);
  }

  @Get(':workspaceId/labels')
  @Roles('viewer')
  labels(@Param('workspaceId') workspaceId: string): Promise<Label[]> {
    return this.workspaces.labels(workspaceId);
  }
}
