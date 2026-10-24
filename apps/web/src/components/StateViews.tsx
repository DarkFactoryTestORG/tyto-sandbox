import { Spinner } from '@plotline/ui-kit';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './StateViews.module.css';

export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className={styles.state}>
      <Spinner label={label} />
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className={styles.state}>
      <p className={styles.title}>{title}</p>
      {children}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className={styles.state} role="alert">
      <p className={styles.title}>Something went wrong</p>
      <p className={styles.muted}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

/** The standard not-found page body. Also used for things the viewer may not see. */
export function NotFound() {
  return (
    <div className={styles.state}>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.muted}>It doesn’t exist, or you don’t have access to it.</p>
      <Link href="/">Back to Plotline</Link>
    </div>
  );
}
