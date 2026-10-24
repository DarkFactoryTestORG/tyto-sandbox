import type { UserSummary } from '@plotline/shared';
import styles from './Avatar.module.css';

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '')).toUpperCase() || '?';
}

export function Avatar({ user, size = 28 }: { user: UserSummary; size?: number }) {
  if (user.avatarUrl) {
    return <img className={styles.avatar} src={user.avatarUrl} alt={user.name} width={size} height={size} />;
  }
  return (
    <span
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      title={user.name}
    >
      <span aria-hidden="true">{initials(user.name)}</span>
      <span className="pl-visually-hidden">{user.name}</span>
    </span>
  );
}
