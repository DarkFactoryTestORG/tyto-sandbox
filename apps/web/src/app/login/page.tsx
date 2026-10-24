'use client';
import type { LoginInput } from '@plotline/shared';
import { Button } from '@plotline/ui-kit';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, Suspense, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import forms from '@/components/forms.module.css';
import styles from './login.module.css';

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get('next');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      await api('/auth/login', { method: 'POST', json: { email, password } satisfies LoginInput });
      router.replace(next?.startsWith('/') ? next : '/');
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? 'Wrong email or password'
          : 'Could not log in. Try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className={`${forms.form} ${styles.card}`} onSubmit={submit}>
      <h1 className={styles.title}>Log in to Plotline</h1>
      {error && (
        <p className={forms.error} role="alert">
          {error}
        </p>
      )}
      <label className={forms.field}>
        <span>Email</span>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className={forms.field}>
        <span>Password</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <Button kind="primary" type="submit" disabled={busy}>
        Log in
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
