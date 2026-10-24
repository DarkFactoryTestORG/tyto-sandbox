'use client';
import type { Project, Task, TaskListPage } from '@plotline/shared';
import { Button, useToast } from '@plotline/ui-kit';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, Suspense, useCallback, useEffect, useState } from 'react';
import forms from '@/components/forms.module.css';
import { ProjectHeader } from '@/components/ProjectHeader';
import { EmptyState, ErrorState, Loading, NotFound } from '@/components/StateViews';
import { TaskCard } from '@/components/TaskCard';
import { TaskDrawer } from '@/components/TaskDrawer';
import { useWorkspace } from '@/components/WorkspaceContext';
import { api } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import styles from './board.module.css';

const PAGE_SIZE = 100;

function Board({ project }: { project: Project }) {
  const { members, canEdit } = useWorkspace();
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const openTaskId = useSearchParams().get('task');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await api<TaskListPage>(`/projects/${project.id}/tasks?page=${p}&pageSize=${PAGE_SIZE}`);
        setTasks((current) => (p === 1 ? res.tasks : [...current, ...res.tasks]));
        setTotal(res.total);
        setPage(p);
        setError(undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load tasks');
      } finally {
        setLoading(false);
      }
    },
    [project.id],
  );

  useEffect(() => {
    void load(1);
  }, [load]);

  const open = (task: Task) => router.push(`${pathname}?task=${task.id}`, { scroll: false });
  const close = useCallback(() => router.push(pathname, { scroll: false }), [router, pathname]);
  const changed = (t: Task) => setTasks((current) => current.map((x) => (x.id === t.id ? t : x)));

  const create = async (e: FormEvent) => {
    e.preventDefault();
    const task = await api<Task>(`/projects/${project.id}/tasks`, { method: 'POST', json: { title } });
    setTitle('');
    setTasks((current) => [task, ...current]);
    setTotal((n) => n + 1);
    toast('Task created');
  };

  const columns = [
    { status: 'open' as const, name: 'Open' },
    { status: 'done' as const, name: 'Done' },
  ];

  return (
    <div className="page">
      <ProjectHeader project={project} members={members} />
      {canEdit && (
        <form onSubmit={create} className={forms.row} aria-label="New task">
          <label className={forms.field}>
            <span className="pl-visually-hidden">New task title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task" />
          </label>
          <Button kind="primary" type="submit" disabled={!title.trim()}>
            Add task
          </Button>
        </form>
      )}
      {error && <ErrorState message={error} onRetry={() => void load(1)} />}
      {loading && tasks.length === 0 && <Loading label="Loading tasks" />}
      {!loading && !error && total === 0 && <EmptyState title="No tasks yet" />}
      {tasks.length > 0 && (
        <div className={styles.board}>
          {columns.map((c) => {
            const inColumn = tasks.filter((t) => t.status === c.status);
            return (
              <section key={c.status} className={styles.column} aria-labelledby={`col-${c.status}`}>
                <h2 id={`col-${c.status}`} className={styles.columnTitle}>
                  {c.name} <span className={styles.count}>{inColumn.length}</span>
                </h2>
                <div className={styles.cards}>
                  {inColumn.map((t) => (
                    <TaskCard key={t.id} task={t} onOpen={open} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
      {tasks.length < total && (
        <div className={styles.more}>
          <Button onClick={() => void load(page + 1)} disabled={loading}>
            Load more ({total - tasks.length} left)
          </Button>
        </div>
      )}
      {openTaskId && <TaskDrawer key={openTaskId} taskId={openTaskId} onClose={close} onChanged={changed} />}
    </div>
  );
}

function ProjectPage() {
  const { workspace } = useWorkspace();
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const project = useApi<Project>(
    `/workspaces/${workspace.id}/projects/by-slug/${encodeURIComponent(projectSlug)}`,
  );
  if (project.error?.status === 404) return <NotFound />;
  if (project.error) return <ErrorState message={project.error.message} onRetry={project.reload} />;
  if (!project.data) return <Loading />;
  return <Board project={project.data} />;
}

export default function ProjectBoardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectPage />
    </Suspense>
  );
}
