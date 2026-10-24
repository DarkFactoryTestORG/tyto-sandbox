'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import styles from './Sidebar.module.css';
import { useWorkspace } from './WorkspaceContext';

export function Sidebar() {
  const { workspace, me } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const base = `/w/${workspace.slug}`;
  const links = [
    { href: base, label: 'Projects' },
    { href: `${base}/my-tasks`, label: 'My tasks' },
    { href: `${base}/settings/members`, label: 'Members' },
  ];
  const logout = async () => {
    await api('/auth/logout', { method: 'POST' });
    router.replace('/login');
  };
  return (
    <nav className={styles.sidebar} aria-label="Workspace">
      <Link href="/" className={styles.workspace}>
        {workspace.name}
      </Link>
      <ul className={styles.links}>
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={styles.link}
              aria-current={pathname === l.href ? 'page' : undefined}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <Link href="/settings/profile" className={styles.link}>
          {me.name}
        </Link>
        <button type="button" className={styles.logout} onClick={logout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
