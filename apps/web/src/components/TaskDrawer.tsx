'use client';
import { type Comment, formatCalendarDate, type Task } from '@plotline/shared';
import { Button, useToast } from '@plotline/ui-kit';
import Link from 'next/link';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import { Avatar } from './Avatar';
import { EditTaskModal } from './EditTaskModal';
import styles from './TaskDrawer.module.css';
import { Loading } from './StateViews';
import { useWorkspace } from './WorkspaceContext';

/** The task drawer: details, complete/reopen, edit, comments. */
export function TaskDrawer({
  taskId,
  onClose,
  onChanged,
}: {
  taskId: string;
  onClose: () => void;
  onChanged: (task: Task) => void;
}) {
  const { workspace, canEdit } = useWorkspace();
  const toast = useToast();
  const task = useApi<Task>(`/tasks/${taskId}`);
  const comments = useApi<Comment[]>(`/tasks/${taskId}/comments`);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !editing) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, editing]);

  const update = (t: Task) => {
    task.setData(t);
    onChanged(t);
  };

  const toggleDone = async () => {
    if (!task.data) return;
    const action = task.data.status === 'open' ? 'complete' : 'reopen';
    update(await api<Task>(`/tasks/${taskId}/${action}`, { method: 'POST' }));
    toast(action === 'complete' ? 'Task completed' : 'Task reopened');
  };

  const addComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await api<Comment>(`/tasks/${taskId}/comments`, { method: 'POST', json: { body: comment } });
    setComment('');
    comments.reload();
  };

  const t = task.data;
  return (
    <aside className={styles.drawer} role="dialog" aria-modal="false" aria-labelledby="task-drawer-title">
      <div className={styles.header}>
        <h2 id="task-drawer-title" className={styles.title}>
          {t?.title ?? 'Task'}
        </h2>
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          aria-label="Close task"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      {!t ? (
        <Loading label="Loading task" />
      ) : (
        <div className={styles.body}>
          <dl className={styles.facts}>
            <dt>Status</dt>
            <dd>{t.status === 'open' ? 'Open' : 'Done'}</dd>
            <dt>Assignee</dt>
            <dd>
              {t.assignee ? (
                <span className={styles.person}>
                  <Avatar user={t.assignee} size={22} /> {t.assignee.name}
                </span>
              ) : (
                'Unassigned'
              )}
            </dd>
            <dt>Due</dt>
            <dd>{t.dueDate ? formatCalendarDate(t.dueDate) : 'No due date'}</dd>
            <dt>Labels</dt>
            <dd>{t.labels.length ? t.labels.map((l) => l.name).join(', ') : 'None'}</dd>
          </dl>
          {t.description && <p className={styles.description}>{t.description}</p>}
          <div className={styles.actions}>
            {canEdit && (
              <>
                <Button kind="primary" onClick={toggleDone}>
                  {t.status === 'open' ? 'Complete' : 'Reopen'}
                </Button>
                <Button onClick={() => setEditing(true)}>Edit</Button>
              </>
            )}
            <Link href={`/w/${workspace.slug}/t/${t.id}`}>Open full page</Link>
          </div>

          <section aria-labelledby="comments-heading">
            <h3 id="comments-heading" className={styles.subheading}>
              Comments
            </h3>
            <ul className={styles.comments}>
              {(comments.data ?? []).map((c) => (
                <li key={c.id}>
                  <strong>{c.author.name}</strong>{' '}
                  <span className={styles.muted}>{new Date(c.createdAt).toLocaleString()}</span>
                  <p>{c.body}</p>
                </li>
              ))}
              {comments.data?.length === 0 && <li className={styles.muted}>No comments yet.</li>}
            </ul>
            {canEdit && (
              <form onSubmit={addComment} className={styles.commentForm}>
                <label className="pl-visually-hidden" htmlFor="new-comment">
                  Add a comment
                </label>
                <textarea
                  id="new-comment"
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment"
                />
                <Button type="submit" size="sm">
                  Comment
                </Button>
              </form>
            )}
          </section>
        </div>
      )}
      {editing && t && (
        <EditTaskModal
          task={t}
          onClose={() => setEditing(false)}
          onSaved={(saved) => {
            update(saved);
            setEditing(false);
          }}
        />
      )}
    </aside>
  );
}
