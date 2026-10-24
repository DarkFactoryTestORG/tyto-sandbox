'use client';
import type { Member, UserSummary } from '@plotline/shared';
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { Avatar } from './Avatar';
import styles from './AssigneePicker.module.css';

export interface AssigneePickerProps {
  members: Member[];
  value: UserSummary | null;
  onChange: (user: UserSummary | null) => void;
  disabled?: boolean;
  /** The visible label. Default "Assignee". */
  label?: string;
}

/** A button that opens a list of the workspace's members, plus "Unassigned". */
export function AssigneePicker({
  members,
  value,
  onChange,
  disabled,
  label = 'Assignee',
}: AssigneePickerProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const options: (UserSummary | null)[] = [null, ...members.map((m) => m.user)];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const choose = (user: UserSummary | null) => {
    onChange(user);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(options[active] ?? null);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <div className={styles.picker} ref={rootRef} onKeyDown={onKeyDown}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={labelId}
        disabled={disabled}
        onClick={() => {
          setActive(0);
          setOpen((o) => !o);
        }}
      >
        {value ? (
          <>
            <Avatar user={value} size={22} /> {value.name}
          </>
        ) : (
          'Unassigned'
        )}
      </button>
      {open && (
        <ul id={listId} role="listbox" aria-labelledby={labelId} className={styles.list}>
          {options.map((user, i) => (
            <li
              key={user?.id ?? 'none'}
              role="option"
              aria-selected={(value?.id ?? null) === (user?.id ?? null)}
              className={`${styles.option} ${i === active ? styles.active : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(user)}
            >
              {user ? (
                <>
                  <Avatar user={user} size={22} /> {user.name}
                </>
              ) : (
                'Unassigned'
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
