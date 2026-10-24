'use client';
import type { Invite, Workspace } from '@plotline/shared';
import { Button } from '@plotline/ui-kit';
import { useParams, useRouter } from 'next/navigation';
import { RequireAuth } from '@/components/RequireAuth';
import { ErrorState, Loading, NotFound } from '@/components/StateViews';
import { api } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import styles from './invite.module.css';

function AcceptInvite() {
  const { inviteId } = useParams<{ inviteId: string }>();
  const invite = useApi<Invite>(`/invites/${inviteId}`);
  const router = useRouter();

  if (invite.error?.status === 404 || invite.error?.status === 400) return <NotFound />;
  if (invite.error) return <ErrorState message={invite.error.message} onRetry={invite.reload} />;
  if (!invite.data) return <Loading />;

  const accept = async () => {
    const workspace = await api<Workspace>(`/invites/${inviteId}/accept`, { method: 'POST' });
    router.push(`/w/${workspace.slug}`);
  };

  return (
    <div className={styles.card}>
      <h1>Join {invite.data.workspaceName}</h1>
      <p>
        You’ve been invited as <strong>{invite.data.role}</strong>.
      </p>
      <Button kind="primary" onClick={() => void accept()}>
        Accept invite
      </Button>
    </div>
  );
}

export default function InvitePage() {
  return <main className={styles.page}>{<RequireAuth>{() => <AcceptInvite />}</RequireAuth>}</main>;
}
