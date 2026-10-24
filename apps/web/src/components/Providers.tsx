'use client';
import { ToastProvider } from '@plotline/ui-kit';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
