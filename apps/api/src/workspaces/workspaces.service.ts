import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { type Database, schema } from '@plotline/db';
import type { Label, Member, Role, UpdateMemberInput, Workspace } from '@plotline/shared';
import { and, asc, eq } from 'drizzle-orm';
import type { AuthUser } from '../auth/auth-user';
import { toMember } from '../common/views';
import { InjectDb } from '../db.module';

const { workspaces, memberships, users, labels } = schema;

@Injectable()
export class WorkspacesService {
  constructor(@InjectDb() private readonly db: Database) {}

  async listMine(user: AuthUser): Promise<Workspace[]> {
    const rows = await this.db
      .select({ w: workspaces, role: memberships.role })
      .from(memberships)
      .innerJoin(workspaces, eq(workspaces.id, memberships.workspaceId))
      .where(eq(memberships.userId, user.id))
      .orderBy(asc(workspaces.name));
    const seen = new Map<string, Workspace>();
    for (const { w, role } of rows) if (!seen.has(w.id)) seen.set(w.id, view(w, role));
    return [...seen.values()];
  }

  async bySlug(user: AuthUser, slug: string): Promise<Workspace> {
    const [row] = await this.db
      .select({ w: workspaces, role: memberships.role })
      .from(workspaces)
      .innerJoin(
        memberships,
        and(eq(memberships.workspaceId, workspaces.id), eq(memberships.userId, user.id)),
      )
      .where(eq(workspaces.slug, slug))
      .limit(1);
    if (!row) throw new NotFoundException('Workspace not found');
    return view(row.w, row.role);
  }

  async get(workspaceId: string, role: Role): Promise<Workspace> {
    const w = await this.db.query.workspaces.findFirst({ where: eq(workspaces.id, workspaceId) });
    if (!w) throw new NotFoundException('Workspace not found');
    return view(w, role);
  }

  async members(workspaceId: string): Promise<Member[]> {
    const rows = await this.db
      .select({ m: memberships, u: users })
      .from(memberships)
      .innerJoin(users, eq(users.id, memberships.userId))
      .where(eq(memberships.workspaceId, workspaceId))
      .orderBy(asc(users.name), asc(memberships.createdAt));
    return rows.map(({ m, u }) => toMember(m, u));
  }

  async updateMember(workspaceId: string, membershipId: string, input: UpdateMemberInput): Promise<Member> {
    const target = await this.findMembership(workspaceId, membershipId);
    if (target.role === 'owner') throw new BadRequestException("The owner's role can't be changed");
    await this.db.update(memberships).set({ role: input.role }).where(eq(memberships.id, membershipId));
    return (await this.members(workspaceId)).find((m) => m.membershipId === membershipId)!;
  }

  async removeMember(workspaceId: string, membershipId: string): Promise<void> {
    const target = await this.findMembership(workspaceId, membershipId);
    if (target.role === 'owner') throw new BadRequestException("The owner can't be removed");
    await this.db.delete(memberships).where(eq(memberships.id, membershipId));
  }

  async labels(workspaceId: string): Promise<Label[]> {
    const rows = await this.db
      .select()
      .from(labels)
      .where(eq(labels.workspaceId, workspaceId))
      .orderBy(asc(labels.name));
    return rows.map((l) => ({ id: l.id, name: l.name, color: l.color }));
  }

  private async findMembership(workspaceId: string, membershipId: string) {
    const m = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.id, membershipId), eq(memberships.workspaceId, workspaceId)),
    });
    if (!m) throw new NotFoundException('Member not found');
    return m;
  }
}

function view(w: typeof workspaces.$inferSelect, role: Role): Workspace {
  return { id: w.id, slug: w.slug, name: w.name, role };
}
