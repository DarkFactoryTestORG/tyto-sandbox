'use client';
import type { Task } from '@plotline/shared';
import { useRouter } from 'next/navigation';
import { EmptyState, ErrorState, Loading } from '@/components/StateViews';
import { TaskCard } from '@/components/TaskCard';
import { useWorkspace } from '@/components/WorkspaceContext';
import { useApi } from '@/lib/useApi';
import styles from './my-tasks.module.css';

export default function MyTasksPage() {
  const { workspace } = useWorkspace();
  const router = useRouter();
  const tasks = useApi<Task[]>(`/me/tasks?workspaceId=${workspace.id}`);
  return (
    <div className="page">
      <h1>My tasks</h1>
      {tasks.loading && !tasks.data && <Loading label="Loading your tasks" />}
      {tasks.error && <ErrorState message={tasks.error.message} onRetry={tasks.reload} />}
      {tasks.data?.length === 0 && <EmptyState title="Nothing assigned to you" />}
      <div className={styles.list}>
        {tasks.data?.map((t) => (
          <TaskCard key={t.id} task={t} onOpen={() => router.push(`/w/${workspace.slug}/t/${t.id}`)} />
        ))}
      </div>
    </div>
  );
}
