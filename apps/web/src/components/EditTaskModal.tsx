'use client';
import type { Task, UpdateTaskInput, UserSummary } from '@plotline/shared';
import { Button, Modal, useToast } from '@plotline/ui-kit';
import { type FormEvent, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { AssigneePicker } from './AssigneePicker';
import styles from './forms.module.css';
import { useWorkspace } from './WorkspaceContext';

export function EditTaskModal({
  task,
  onClose,
  onSaved,
}: {
  task: Task;
  onClose: () => void;
  onSaved: (task: Task) => void;
}) {
  const { members } = useWorkspace();
  const toast = useToast();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate ?? '');
  const [assignee, setAssignee] = useState<UserSummary | null>(task.assignee);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body: UpdateTaskInput = {
      title,
      description,
      dueDate: dueDate || null,
      assigneeId: assignee?.id ?? null,
    };
    try {
      const saved = await api<Task>(`/tasks/${task.id}`, { method: 'PATCH', json: body });
      toast('Task saved');
      onSaved(saved);
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) setErrors(error.fieldErrors);
      else toast(error instanceof Error ? error.message : 'Could not save', { tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit task"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button kind="primary" type="submit" form="edit-task" disabled={saving}>
            Save
          </Button>
        </>
      }
    >
      <form id="edit-task" className={styles.form} onSubmit={save} noValidate>
        <label className={styles.field}>
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={!!errors.title}
            required
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </label>
        <label className={styles.field}>
          <span>Description</span>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Due date</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-invalid={!!errors.dueDate}
          />
          {errors.dueDate && <span className={styles.error}>{errors.dueDate}</span>}
        </label>
        <AssigneePicker members={members} value={assignee} onChange={setAssignee} />
        {errors.assigneeId && <span className={styles.error}>{errors.assigneeId}</span>}
      </form>
    </Modal>
  );
}
