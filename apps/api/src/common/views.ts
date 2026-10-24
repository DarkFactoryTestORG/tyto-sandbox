// Row → response shapes (packages/shared/src/types.ts).
import type { schema } from '@plotline/db';
import type { Member, Project, UserSummary, User } from '@plotline/shared';

type UserRow = typeof schema.users.$inferSelect;

export const toUser = (u: UserRow): User => ({
  id: u.id,
  email: u.email,
  name: u.name,
  timezone: u.timezone,
  avatarUrl: u.avatarUrl,
  slackUserId: u.slackUserId,
});

export const toUserSummary = (u: Pick<UserRow, 'id' | 'name' | 'avatarUrl'>): UserSummary => ({
  id: u.id,
  name: u.name,
  avatarUrl: u.avatarUrl,
});

export const toProject = (p: typeof schema.projects.$inferSelect): Project => ({
  id: p.id,
  workspaceId: p.workspaceId,
  slug: p.slug,
  name: p.name,
  description: p.description,
  createdAt: p.createdAt.toISOString(),
});

export const toMember = (m: typeof schema.memberships.$inferSelect, u: UserRow): Member => ({
  membershipId: m.id,
  role: m.role,
  joinedAt: m.createdAt.toISOString(),
  user: { ...toUserSummary(u), email: u.email },
});
