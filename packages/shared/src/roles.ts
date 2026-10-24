export const ROLES = ['owner', 'admin', 'member', 'viewer'] as const;
export type Role = (typeof ROLES)[number];

const RANK: Record<Role, number> = { viewer: 0, member: 1, admin: 2, owner: 3 };

/** True when `role` is `required` or above it (owner > admin > member > viewer). */
export function hasRole(role: Role, required: Role): boolean {
  return RANK[role] >= RANK[required];
}

/** The higher of two roles. */
export function highestRole(a: Role, b: Role): Role {
  return RANK[a] >= RANK[b] ? a : b;
}
