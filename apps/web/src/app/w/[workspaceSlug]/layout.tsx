'use client';
import type { Member, User, Workspace } from '@plotline/shared';
import { useParams } from 'next/navigation';
import { type ReactNode, useMemo } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { Sidebar } from '@/components/Sidebar';
import { ErrorState, Loading, NotFound } from '@/components/StateViews';
import { WorkspaceContext } from '@/components/WorkspaceContext';
import { useApi } from '@/lib/useApi';
import styles from './workspace.module.css';

function WorkspaceShell({ me, children }: { me: User; children: ReactNode }) {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const workspace = useApi<Workspace>(`/workspaces/by-slug/${encodeURIComponent(workspaceSlug)}`);
  const members = useApi<Member[]>(workspace.data ? `/workspaces/${workspace.data.id}/members` : null);
  const value = useMemo(
    () =>
      workspace.data && members.data
        ? {
            workspace: workspace.data,
            me,
            members: members.data,
            canEdit: workspace.data.role !== 'viewer',
            reloadMembers: members.reload,
          }
        : null,
    [workspace.data, members.data, members.reload, me],
  );

  if (workspace.error?.status === 404) return <NotFound />;
  if (workspace.error) return <ErrorState message={workspace.error.message} onRetry={workspace.reload} />;
  if (!value) return <Loading />;
  return (
    <WorkspaceContext.Provider value={value}>
      <div className={styles.shell}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </WorkspaceContext.Provider>
  );
}

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{(me) => <WorkspaceShell me={me}>{children}</WorkspaceShell>}</RequireAuth>;
}
