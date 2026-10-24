// `baseline`: exactly the fixtures the issue catalogue names (workspace.acme with user.owner,
// user.member and project.alpha; workspace.other), plus a few tasks. Issues add fixtures here.
import type { Seeder } from './lib';

export function baseline(s: Seeder): void {
  const owner = s.user('user.owner', {
    email: 'owner@plotline.test',
    name: 'Olivia Owner',
    timezone: 'Europe/London',
  });
  const member = s.user('user.member', {
    email: 'member@plotline.test',
    name: 'Max Member',
    timezone: 'UTC',
  });
  const otherOwner = s.user('user.other-owner', { email: 'other-owner@plotline.test', name: 'Oscar Other' });

  const acme = s.workspace('workspace.acme', { slug: 'acme', name: 'Acme' });
  s.member('membership.acme-owner', acme, owner, 'owner');
  s.member('membership.acme-member', acme, member, 'member');

  const other = s.workspace('workspace.other', { slug: 'other', name: 'Other Co' });
  s.member('membership.other-owner', other, otherOwner, 'owner');

  const bug = s.label('label.bug', acme, 'bug', '#d93f0b');
  const chore = s.label('label.chore', acme, 'chore', '#0e8a16');

  const alpha = s.project('project.alpha', acme, {
    slug: 'alpha',
    name: 'Alpha',
    description: 'The first project in Acme.',
  });
  const t1 = s.task('task.alpha-plan', alpha, {
    title: 'Write the launch plan',
    description: 'Dates, owners and the go/no-go checklist.',
    assigneeId: owner,
    dueDate: s.dueIn(7),
    createdById: owner,
    createdDaysAgo: 20,
  });
  const t2 = s.task('task.alpha-login-bug', alpha, {
    title: 'Fix the login redirect loop',
    assigneeId: member,
    dueDate: s.dueIn(-2),
    createdById: owner,
    createdDaysAgo: 10,
    labelIds: [bug],
  });
  s.task('task.alpha-deps', alpha, {
    title: 'Update dependencies',
    createdById: member,
    createdDaysAgo: 5,
    labelIds: [chore],
  });
  const t4 = s.task('task.alpha-kickoff', alpha, {
    title: 'Kickoff meeting notes',
    assigneeId: member,
    createdById: owner,
    createdDaysAgo: 30,
    done: true,
  });
  s.comment('comment.alpha-login-bug-1', t2, owner, 'Happens on Safari only, as far as I can tell.');

  s.activity('activity.alpha-1', {
    workspaceId: acme,
    kind: 'created',
    actorId: owner,
    taskId: t1,
    at: s.days(-20),
  });
  s.activity('activity.alpha-2', {
    workspaceId: acme,
    kind: 'created',
    actorId: owner,
    taskId: t2,
    at: s.days(-10),
  });
  s.activity('activity.alpha-3', {
    workspaceId: acme,
    kind: 'assigned',
    actorId: owner,
    taskId: t2,
    at: s.days(-10),
  });
  s.activity('activity.alpha-4', {
    workspaceId: acme,
    kind: 'commented',
    actorId: owner,
    taskId: t2,
    at: s.days(-3),
  });
  s.activity('activity.alpha-5', {
    workspaceId: acme,
    kind: 'completed',
    actorId: member,
    taskId: t4,
    at: s.days(-1),
  });

  const otherProject = s.project('project.other', other, { slug: 'roadmap', name: 'Roadmap' });
  s.task('task.other-1', otherProject, {
    title: 'Draft the roadmap',
    assigneeId: otherOwner,
    createdById: otherOwner,
  });
}
