// `review` (F20): the dataset every reviewer sees in a preview. It is baseline plus a richer,
// stable world: several workspaces, every role, overdue and upcoming tasks across timezones,
// comments, activity and pending invites. The accounts are listed in ./README.md; keep it in step.
import { baseline } from '../baseline';
import type { Seeder } from '../lib';

export function review(s: Seeder): void {
  baseline(s);
  const acme = s.fixtures['workspace.acme']!;
  const owner = s.fixtures['user.owner']!;
  const member = s.fixtures['user.member']!;

  const ny = s.user('user.ny', {
    email: 'nora@plotline.test',
    name: 'Nora Newyork',
    timezone: 'America/New_York',
  });
  const la = s.user('user.la', {
    email: 'luis@plotline.test',
    name: 'Luis Angeles',
    timezone: 'America/Los_Angeles',
  });
  const tokyo = s.user('user.tokyo', {
    email: 'kenji@plotline.test',
    name: 'Kenji Tokyo',
    timezone: 'Asia/Tokyo',
  });
  const akl = s.user('user.auckland', {
    email: 'aroha@plotline.test',
    name: 'Aroha Auckland',
    timezone: 'Pacific/Auckland',
  });
  const admin = s.user('user.admin', {
    email: 'adele@plotline.test',
    name: 'Adele Admin',
    timezone: 'Europe/Berlin',
  });
  const viewer = s.user('user.viewer', {
    email: 'victor@plotline.test',
    name: 'Victor Viewer',
    timezone: 'UTC',
  });

  s.member('membership.acme-admin', acme, admin, 'admin');
  s.member('membership.acme-viewer', acme, viewer, 'viewer');
  s.member('membership.acme-ny', acme, ny, 'member');
  s.member('membership.acme-la', acme, la, 'member');

  const design = s.label('label.design', acme, 'design', '#5319e7');
  const urgent = s.label('label.urgent', acme, 'urgent', '#b60205');
  const bug = s.fixtures['label.bug']!;

  const website = s.project('project.website', acme, {
    slug: 'website',
    name: 'Website relaunch',
    description: 'New marketing site, pricing page and blog.',
  });
  const plan: [string, string, string | null, number | null, boolean, string[]][] = [
    ['task.web-hero', 'Design the hero section', la, 3, false, [design]],
    ['task.web-pricing', 'Pricing page copy', ny, -4, false, [urgent]],
    ['task.web-blog', 'Migrate the blog posts', member, 10, false, []],
    ['task.web-analytics', 'Set up analytics', admin, -1, false, [bug]],
    ['task.web-domain', 'Point the domain at the new host', owner, 0, false, [urgent]],
    ['task.web-fonts', 'Choose the fonts', la, null, true, [design]],
    ['task.web-legal', 'Legal review of the terms', null, 21, false, []],
    ['task.web-404', 'Friendly 404 page', ny, 5, false, [design]],
  ];
  plan.forEach(([fixture, title, assigneeId, due, done, labelIds], i) => {
    const id = s.task(fixture, website, {
      title,
      assigneeId,
      dueDate: due === null ? null : s.dueIn(due),
      createdById: owner,
      createdDaysAgo: 25 - i,
      done,
      labelIds,
    });
    s.activity(`activity.${fixture}-created`, {
      workspaceId: acme,
      kind: 'created',
      actorId: owner,
      taskId: id,
      at: s.days(-(25 - i)),
    });
    if (done)
      s.activity(`activity.${fixture}-completed`, {
        workspaceId: acme,
        kind: 'completed',
        actorId: assigneeId ?? owner,
        taskId: id,
        at: s.days(-1),
      });
  });
  const pricing = s.fixtures['task.web-pricing']!;
  s.comment('comment.web-pricing-1', pricing, owner, 'Can we have a first draft by Friday?', 4);
  s.comment('comment.web-pricing-2', pricing, ny, 'Yes — sharing a doc tomorrow.', 3);
  s.activity('activity.web-pricing-commented', {
    workspaceId: acme,
    kind: 'commented',
    actorId: ny,
    taskId: pricing,
    at: s.days(-3),
  });

  s.invite('invite.acme-pending', acme, 'pat@plotline.test', { role: 'member', invitedById: owner });
  s.invite('invite.acme-pending-viewer', acme, 'quinn@plotline.test', { role: 'viewer', invitedById: admin });

  // A second, annual-plan workspace on the far side of the date line.
  const harbor = s.workspace('workspace.harbor', {
    slug: 'harbor',
    name: 'Harbor Labs',
    plan: 'annual',
    billingAnchor: '2026-03-01',
  });
  s.member('membership.harbor-owner', harbor, tokyo, 'owner');
  s.member('membership.harbor-admin', harbor, akl, 'admin');
  s.member('membership.harbor-member', harbor, owner, 'member');
  s.member('membership.harbor-viewer', harbor, la, 'viewer');
  const research = s.project('project.research', harbor, {
    slug: 'research',
    name: 'Research',
    description: 'Interviews and findings.',
  });
  s.task('task.research-interviews', research, {
    title: 'Schedule five customer interviews',
    assigneeId: akl,
    dueDate: s.dueIn(2),
    createdById: tokyo,
  });
  s.task('task.research-synthesis', research, {
    title: 'Synthesise the findings',
    assigneeId: tokyo,
    dueDate: s.dueIn(-6),
    createdById: tokyo,
  });
  s.task('task.research-report', research, {
    title: 'Share the report with the team',
    assigneeId: owner,
    dueDate: s.dueIn(14),
    createdById: tokyo,
  });
  s.invite('invite.harbor-pending', harbor, 'member@plotline.test', { role: 'member', invitedById: tokyo });
}
