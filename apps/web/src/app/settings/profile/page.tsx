'use client';
import type { User } from '@plotline/shared';
import { Button, useToast } from '@plotline/ui-kit';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';
import forms from '@/components/forms.module.css';
import { RequireAuth } from '@/components/RequireAuth';
import { api, ApiError } from '@/lib/api';
import { COMMON_TIMEZONES } from '@/lib/timezones';

function ProfileForm({ me }: { me: User }) {
  const toast = useToast();
  const [name, setName] = useState(me.name);
  const [timezone, setTimezone] = useState(me.timezone);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const zones = COMMON_TIMEZONES.includes(me.timezone)
    ? COMMON_TIMEZONES
    : [me.timezone, ...COMMON_TIMEZONES];

  const save = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api<User>('/me', { method: 'PATCH', json: { name, timezone } });
      setErrors({});
      toast('Profile saved');
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fieldErrors);
    }
  };

  return (
    <div className="page">
      <p>
        <Link href="/">← Back</Link>
      </p>
      <h1>Your profile</h1>
      <form onSubmit={save} className={forms.form} style={{ maxWidth: 420 }}>
        <label className={forms.field}>
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
          {errors.name && <span className={forms.error}>{errors.name}</span>}
        </label>
        <label className={forms.field}>
          <span>Timezone</span>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            aria-invalid={!!errors.timezone}
          >
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
          {errors.timezone && <span className={forms.error}>{errors.timezone}</span>}
        </label>
        <Button kind="primary" type="submit">
          Save
        </Button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return <main>{<RequireAuth>{(me) => <ProfileForm me={me} />}</RequireAuth>}</main>;
}
