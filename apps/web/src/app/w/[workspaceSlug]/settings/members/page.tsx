'use client';
import { hasRole, type Invite, type Member, type Role } from '@plotline/shared';
import { Button, useToast } from '@plotline/ui-kit';
import { type FormEvent, useState } from 'react';
import { Avatar } from '@/components/Avatar';
import forms from '@/components/forms.module.css';
import { useWorkspace } from '@/components/WorkspaceContext';
import { api, ApiError } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import styles from './members.module.css';

const ASSIGNABLE: Exclude<Role, 'owner'>[] = ['admin', 'member', 'viewer'];

export default function MembersPage() {
  const { workspace, members, reloadMembers } = useWorkspace();
  const isAdmin = hasRole(workspace.role, 'admin');
  const invites = useApi<Invite[]>(isAdmin ? `/workspaces/${workspace.id}/invites` : null);
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Exclude<Role, 'owner'>>('member');
  const [error, setError] = useState<string>();

  const changeRole = async (m: Member, next: Role) => {
    await api(`/workspaces/${workspace.id}/members/${m.membershipId}`, {
      method: 'PATCH',
      json: { role: next },
    });
    reloadMembers();
    toast(`${m.user.name} is now ${next}`);
  };

  const invite = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api(`/workspaces/${workspace.id}/invites`, { method: 'POST', json: { email, role } });
      setEmail('');
      setError(undefined);
      invites.reload();
      toast(`Invited ${email}`);
    } catch (err) {
      setError(
        err instanceof ApiError ? (err.fieldErrors.email ?? err.message) : 'Could not send the invite',
      );
    }
  };

  return (
    <div className="page">
      <h1>Members</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.membershipId}>
              <td>
                <span className={styles.person}>
                  <Avatar user={m.user} size={24} /> {m.user.name}
                </span>
              </td>
              <td>{m.user.email}</td>
              <td>
                {isAdmin && m.role !== 'owner' ? (
                  <select
                    aria-label={`Role of ${m.user.name}`}
                    value={m.role}
                    onChange={(e) => void changeRole(m, e.target.value as Role)}
                  >
                    {ASSIGNABLE.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                ) : (
                  m.role
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAdmin && (
        <>
          <h2>Invite someone</h2>
          <form onSubmit={invite} className={forms.row}>
            <label className={forms.field}>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                required
              />
              {error && <span className={forms.error}>{error}</span>}
            </label>
            <label className={forms.field}>
              <span>Role</span>
              <select value={role} onChange={(e) => setRole(e.target.value as Exclude<Role, 'owner'>)}>
                {ASSIGNABLE.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <Button kind="primary" type="submit">
              Send invite
            </Button>
          </form>
          {invites.data && invites.data.length > 0 && (
            <>
              <h2>Pending invites</h2>
              <ul>
                {invites.data.map((i) => (
                  <li key={i.id}>
                    {i.email} ({i.role})
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
