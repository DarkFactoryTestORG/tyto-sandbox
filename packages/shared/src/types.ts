import type { Role } from './roles';

export interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  avatarUrl: string | null;
  slackUserId: string | null;
}

export interface UserSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface Workspace {
  id: string;
  slug: string;
  name: string;
  role: Role;
}

export interface Member {
  membershipId: string;
  role: Role;
  joinedAt: string;
  user: UserSummary & { email: string };
}

export interface Invite {
  id: string;
  workspaceId: string;
  workspaceName: string;
  email: string;
  role: Role;
  status: 'pending' | 'accepted' | 'revoked';
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  slug: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export type TaskStatus = 'open' | 'done';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: UserSummary | null;
  /** YYYY-MM-DD, or null. */
  dueDate: string | null;
  labels: Label[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface TaskListPage {
  tasks: Task[];
  page: number;
  pageSize: number;
  total: number;
}

export interface Comment {
  id: string;
  taskId: string;
  author: UserSummary;
  body: string;
  createdAt: string;
}

export type ActivityKind = 'created' | 'completed' | 'assigned' | 'commented';

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  actorId: string;
  taskId: string;
  at: string;
}

export interface ActivityPage {
  events: ActivityEvent[];
  nextCursor: string | null;
}

export interface BillingSummary {
  plan: 'monthly' | 'annual';
  seats: number;
  seatPriceCents: number;
  cycleStart: string;
  cycleEnd: string;
  totalCents: number;
}

export interface SlackConnection {
  status: 'connected' | 'disconnected';
  teamName: string;
  connectedAt: string;
}
