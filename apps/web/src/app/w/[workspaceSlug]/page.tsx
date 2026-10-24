'use client';
import type { Project } from '@plotline/shared';
import { Button, useToast } from '@plotline/ui-kit';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';
import forms from '@/components/forms.module.css';
import { EmptyState, ErrorState, Loading } from '@/components/StateViews';
import { useWorkspace } from '@/components/WorkspaceContext';
import { api, ApiError } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import styles from './projects.module.css';

export default function ProjectsPage() {
  const { workspace, canEdit } = useWorkspace();
  const projects = useApi<Project[]>(`/workspaces/${workspace.id}/projects`);
  const toast = useToast();
  const [name, setName] = useState('');
  const [error, setError] = useState<string>();

  const create = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const project = await api<Project>(`/workspaces/${workspace.id}/projects`, {
        method: 'POST',
        json: { name },
      });
      setName('');
      setError(undefined);
      projects.reload();
      toast(`Created ${project.name}`);
    } catch (err) {
      setError(
        err instanceof ApiError ? (err.fieldErrors.name ?? err.message) : 'Could not create the project',
      );
    }
  };

  return (
    <div className="page">
      <h1>Projects</h1>
      {projects.loading && !projects.data && <Loading label="Loading projects" />}
      {projects.error && <ErrorState message={projects.error.message} onRetry={projects.reload} />}
      {projects.data?.length === 0 && <EmptyState title="No projects yet" />}
      {projects.data && projects.data.length > 0 && (
        <ul className={styles.list}>
          {projects.data.map((p) => (
            <li key={p.id} className={styles.item}>
              <Link href={`/w/${workspace.slug}/p/${p.slug}`} className={styles.name}>
                {p.name}
              </Link>
              {p.description && <p className={styles.description}>{p.description}</p>}
            </li>
          ))}
        </ul>
      )}
      {canEdit && (
        <form onSubmit={create} className={forms.row} aria-label="New project">
          <label className={forms.field}>
            <span>New project</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              aria-invalid={!!error}
            />
            {error && <span className={forms.error}>{error}</span>}
          </label>
          <Button kind="primary" type="submit" disabled={!name.trim()}>
            Create
          </Button>
        </form>
      )}
    </div>
  );
}
