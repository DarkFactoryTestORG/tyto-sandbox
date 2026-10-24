import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { type Database, schema } from '@plotline/db';
import type { CreateInviteInput, Invite, Workspace } from '@plotline/shared';
import { and, desc, eq } from 'drizzle-orm';
import type { AuthUser } from '../auth/auth-user';
import { InjectDb } from '../db.module';

const { invites, memberships, workspaces, users } = schema;

@Injectable()
export class InvitesService {
  constructor(@InjectDb() private readonly db: Database) {}

  async create(workspaceId: string, inviter: AuthUser, input: Required<CreateInviteInput>): Promise<Invite> {
    const existingUser = await this.db.query.users.findFirst({ where: eq(users.email, input.email) });
    if (existingUser) {
      const member = await this.db.query.memberships.findFirst({
        where: and(eq(memberships.workspaceId, workspaceId), eq(memberships.userId, existingUser.id)),
      });
      if (member) throw new ConflictException(`${input.email} is already a member`);
    }
    const [row] = await this.db
      .insert(invites)
      .values({ workspaceId, email: input.email, role: input.role, invitedById: inviter.id })
      .returning();
    return this.view(row!);
  }

  async pending(workspaceId: string): Promise<Invite[]> {
    const rows = await this.db
      .select()
      .from(invites)
      .where(and(eq(invites.workspaceId, workspaceId), eq(invites.status, 'pending')))
      .orderBy(desc(invites.createdAt));
    return Promise.all(rows.map((r) => this.view(r)));
  }

  /** An invite addressed to this user. Anyone else gets 404. */
  async getForUser(user: AuthUser, inviteId: string): Promise<Invite> {
    return this.view(await this.findForUser(user, inviteId));
  }

  async accept(user: AuthUser, inviteId: string): Promise<Workspace> {
    const invite = await this.findForUser(user, inviteId);
    const existing = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, invite.workspaceId), eq(memberships.userId, user.id)),
    });
    const workspace = await this.db.query.workspaces.findFirst({
      where: eq(workspaces.id, invite.workspaceId),
    });
    if (!workspace) throw new NotFoundException('Invite not found');
    let role = existing?.role ?? invite.role;
    if (!existing) {
      const [created] = await this.db
        .insert(memberships)
        .values({ workspaceId: invite.workspaceId, userId: user.id, role: invite.role })
        .returning();
      role = created!.role;
    }
    if (invite.status === 'pending') {
      await this.db
        .update(invites)
        .set({ status: 'accepted', acceptedAt: new Date() })
        .where(eq(invites.id, invite.id));
    }
    return { id: workspace.id, slug: workspace.slug, name: workspace.name, role };
  }

  private async findForUser(user: AuthUser, inviteId: string) {
    const invite = await this.db.query.invites.findFirst({ where: eq(invites.id, inviteId) });
    if (!invite || invite.status === 'revoked' || invite.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new NotFoundException('Invite not found');
    }
    return invite;
  }

  private async view(row: typeof invites.$inferSelect): Promise<Invite> {
    const w = await this.db.query.workspaces.findFirst({ where: eq(workspaces.id, row.workspaceId) });
    return {
      id: row.id,
      workspaceId: row.workspaceId,
      workspaceName: w?.name ?? '',
      email: row.email,
      role: row.role,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
