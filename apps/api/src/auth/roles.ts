import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Database, schema } from '@plotline/db';
import { hasRole, type Role } from '@plotline/shared';
import { and, eq } from 'drizzle-orm';
import type { Request } from 'express';
import { InjectDb } from '../db.module';

const ROLES_KEY = 'plotline:roles';

/**
 * The lowest workspace role a route needs. The workspace is the route's `:workspaceId`.
 * Non-members get 404, so a workspace's existence is not revealed; members below the role get 403.
 */
export const Roles = (role: Role) => SetMetadata(ROLES_KEY, role);

export type Membership = typeof schema.memberships.$inferSelect;
export type RequestWithMembership = Request & { membership?: Membership };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectDb() private readonly db: Database,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<Role | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true;
    const req = context.switchToHttp().getRequest<RequestWithMembership>();
    const workspaceId = req.params.workspaceId;
    if (!req.user || typeof workspaceId !== 'string')
      throw new Error('RolesGuard needs AuthenticatedGuard and a :workspaceId route');
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const membership = uuid.test(workspaceId)
      ? await this.db.query.memberships.findFirst({
          where: and(
            eq(schema.memberships.workspaceId, workspaceId),
            eq(schema.memberships.userId, req.user.id),
          ),
        })
      : undefined;
    if (!membership) throw new NotFoundException('Workspace not found');
    if (!hasRole(membership.role, required)) throw new ForbiddenException(`Needs the ${required} role`);
    req.membership = membership;
    return true;
  }
}
