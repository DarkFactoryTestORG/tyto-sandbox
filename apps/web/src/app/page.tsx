'use client';
import type { Workspace } from '@plotline/shared';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { EmptyState, Loading } from '@/components/StateViews';
import { useApi } from '@/lib/useApi';

function Home() {
  const workspaces = useApi<Workspace[]>('/workspaces');
  const router = useRouter();
  const first = workspaces.data?.[0];
  useEffect(() => {
    if (first) router.replace(`/w/${first.slug}`);
  }, [first, router]);
  if (workspaces.data && !first) {
    return (
      <EmptyState title="You’re not in any workspace yet">
        <p>Ask a workspace admin to invite you.</p>
      </EmptyState>
    );
  }
  return <Loading />;
}

export default function HomePage() {
  return <main>{<RequireAuth>{() => <Home />}</RequireAuth>}</main>;
}
