import type { Member, Project } from '@plotline/shared';
import { initials } from './Avatar';
import styles from './ProjectHeader.module.css';

const SHOWN = 3;

export function ProjectHeader({ project, members }: { project: Project; members: Member[] }) {
  const shown = members.slice(0, SHOWN);
  const rest = members.length - shown.length;
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.name}>{project.name}</h1>
        {project.description && <p className={styles.description}>{project.description}</p>}
      </div>
      <div className={styles.members} aria-label={`${members.length} members`}>
        {shown.map((m, i) => (
          <span
            key={m.membershipId}
            className={styles.member}
            style={{ zIndex: SHOWN - i }}
            title={m.user.name}
          >
            {m.user.avatarUrl ? <img src={m.user.avatarUrl} alt="" /> : initials(m.user.name)}
          </span>
        ))}
        {rest > 0 && <span className={styles.more}>+{rest}</span>}
      </div>
    </header>
  );
}
