'use client';
import { formatCalendarDate, type Task, type UserSummary } from '@plotline/shared';
import { useToast } from '@plotline/ui-kit';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AssigneePicker } from '@/components/AssigneePicker';
import { ErrorState, Loading, NotFound } from '@/components/StateViews';
import { useWorkspace } from '@/components/WorkspaceContext';
import { api } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import styles from './task.module.css';

/** The task page: the task on its own, with the assignee picker inline. */
export default function TaskPage() {
  const { workspace, members, canEdit } = useWorkspace();
  const { taskId } = useParams<{ taskId: string }>();
  const task = useApi<Task>(`/tasks/${taskId}`);
  const project = useApi<{ slug: string; name: string }>(
    task.data ? `/projects/${task.data.projectId}` : null,
  );
  const toast = useToast();

  if (task.error?.status === 404 || task.error?.status === 400) return <NotFound />;
  if (task.error) return <ErrorState message={task.error.message} onRetry={task.reload} />;
  if (!task.data) return <Loading />;
  const t = task.data;

  const assign = async (user: UserSummary | null) => {
    task.setData(
      await api<Task>(`/tasks/${t.id}`, { method: 'PATCH', json: { assigneeId: user?.id ?? null } }),
    );
    toast(user ? `Assigned to ${user.name}` : 'Unassigned');
  };

  return (
    <div className="page">
      {project.data && (
        <p className={styles.crumb}>
          <Link href={`/w/${workspace.slug}/p/${project.data.slug}`}>{project.data.name}</Link>
        </p>
      )}
      <h1>{t.title}</h1>
      <p className={styles.status}>
        {t.status === 'open' ? 'Open' : 'Done'} ·{' '}
        {t.dueDate ? `Due ${formatCalendarDate(t.dueDate)}` : 'No due date'}
      </p>
      {t.description && <p className={styles.description}>{t.description}</p>}
      <div className={styles.assignee}>
        <AssigneePicker
          members={members}
          value={t.assignee}
          onChange={(u) => void assign(u)}
          disabled={!canEdit}
        />
      </div>
    </div>
  );
}
