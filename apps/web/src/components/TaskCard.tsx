import type { Task } from '@plotline/shared';
import { Avatar } from './Avatar';
import styles from './TaskCard.module.css';

/** A task on the project board and in My tasks. */
export function TaskCard({ task, onOpen }: { task: Task; onOpen: (task: Task) => void }) {
  return (
    <article className={styles.card} data-testid="task-card">
      <button type="button" className={styles.title} onClick={() => onOpen(task)}>
        {task.title}
      </button>
      <div className={styles.meta}>
        <ul className={styles.labels} aria-label="Labels">
          {task.labels.map((l) => (
            <li key={l.id} className={styles.label} style={{ borderColor: l.color, color: l.color }}>
              {l.name}
            </li>
          ))}
        </ul>
        {task.assignee && <Avatar user={task.assignee} size={24} />}
      </div>
    </article>
  );
}
