'use client';
import type { User } from '@plotline/shared';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { useApi } from '@/lib/useApi';
import { ErrorState, Loading } from './StateViews';

/** Renders children with the logged-in user, or sends the visitor to /login. */
export function RequireAuth({ children }: { children: (me: User) => ReactNode }) {
  const me = useApi<User>('/auth/me');
  const router = useRouter();
  const pathname = usePathname();
  const unauthenticated = me.error?.status === 401;

  useEffect(() => {
    if (unauthenticated) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [unauthenticated, router, pathname]);

  if (me.data) return <>{children(me.data)}</>;
  if (me.error && !unauthenticated) return <ErrorState message={me.error.message} onRetry={me.reload} />;
  return <Loading />;
}
