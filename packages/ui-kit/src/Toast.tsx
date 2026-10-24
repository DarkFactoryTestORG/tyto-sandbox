'use client';
import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';
import styles from './Toast.module.css';

export interface ToastOptions {
  tone?: 'info' | 'error';
  /** Milliseconds before it disappears. Default 4000. */
  duration?: number;
}

export type ShowToast = (message: string, options?: ToastOptions) => void;

const ToastContext = createContext<ShowToast | null>(null);

interface Item {
  id: number;
  message: string;
  tone: 'info' | 'error';
}

let nextId = 1;

/** Wrap the app once; toasts render in a polite live region. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const show = useCallback<ShowToast>((message, options = {}) => {
    const id = nextId++;
    setItems((current) => [...current, { id, message, tone: options.tone ?? 'info' }]);
    setTimeout(() => setItems((current) => current.filter((i) => i.id !== id)), options.duration ?? 4000);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        {items.map((i) => (
          <div key={i.id} className={`${styles.toast} ${i.tone === 'error' ? styles.error : ''}`}>
            {i.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Returns the function that shows a toast. */
export function useToast(): ShowToast {
  const show = useContext(ToastContext);
  if (!show) throw new Error('useToast must be used inside <ToastProvider>');
  return show;
}
