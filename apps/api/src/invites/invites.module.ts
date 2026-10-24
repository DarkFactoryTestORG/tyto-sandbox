import {
  Body,
  Controller,
  Get,
  HttpCode,
  Module,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { type CreateInviteInput, createInviteSchema, type Invite, type Workspace } from '@plotline/shared';
import type { AuthUser } from '../auth/auth-user';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthenticatedGuard } from '../auth/guards';
import { Roles, RolesGuard } from '../auth/roles';
import { ZodPipe } from '../common/zod.pipe';
import { InvitesService } from './invites.service';

@Controller('workspaces/:workspaceId/invites')
@UseGuards(AuthenticatedGuard, RolesGuard)
export class WorkspaceInvitesController {
  constructor(private readonly invites: InvitesService) {}

  @Post()
  @Roles('admin')
  create(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser() user: AuthUser,
    @Body(new ZodPipe(createInviteSchema)) body: Required<CreateInviteInput>,
  ): Promise<Invite> {
    return this.invites.create(workspaceId, user, body);
  }

  @Get()
  @Roles('admin')
  pending(@Param('workspaceId') workspaceId: string): Promise<Invite[]> {
    return this.invites.pending(workspaceId);
  }
}

@Controller('invites')
@UseGuards(AuthenticatedGuard)
export class InvitesController {
  constructor(private readonly invites: InvitesService) {}

  @Get(':inviteId')
  get(@CurrentUser() user: AuthUser, @Param('inviteId', ParseUUIDPipe) inviteId: string): Promise<Invite> {
    return this.invites.getForUser(user, inviteId);
  }

  @Post(':inviteId/accept')
  @HttpCode(200)
  accept(
    @CurrentUser() user: AuthUser,
    @Param('inviteId', ParseUUIDPipe) inviteId: string,
  ): Promise<Workspace> {
    return this.invites.accept(user, inviteId);
  }
}

@Module({ controllers: [WorkspaceInvitesController, InvitesController], providers: [InvitesService] })
export class InvitesModule {}
