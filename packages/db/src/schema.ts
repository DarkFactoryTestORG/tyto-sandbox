import {
  date,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['owner', 'admin', 'member', 'viewer']);
export const taskStatusEnum = pgEnum('task_status', ['open', 'done']);
export const planEnum = pgEnum('billing_plan', ['monthly', 'annual']);
export const inviteStatusEnum = pgEnum('invite_status', ['pending', 'accepted', 'revoked']);
export const activityKindEnum = pgEnum('activity_kind', ['created', 'completed', 'assigned', 'commented']);
export const slackStatusEnum = pgEnum('slack_status', ['connected', 'disconnected']);

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  /** IANA zone, e.g. America/New_York. */
  timezone: text('timezone').notNull().default('UTC'),
  avatarUrl: text('avatar_url'),
  /** Set when the user links their Slack account. */
  slackUserId: text('slack_user_id'),
  createdAt: createdAt(),
});

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  plan: planEnum('plan').notNull().default('monthly'),
  seatPriceCents: integer('seat_price_cents').notNull().default(800),
  /** The first day of the first billing cycle; cycles repeat monthly or yearly from it. */
  billingAnchor: date('billing_anchor', { mode: 'string' }).notNull(),
  createdAt: createdAt(),
});

export const memberships = pgTable(
  'memberships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: roleEnum('role').notNull().default('member'),
    createdAt: createdAt(),
  },
  (t) => [index('memberships_workspace_idx').on(t.workspaceId), index('memberships_user_idx').on(t.userId)],
);

export const invites = pgTable(
  'invites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: roleEnum('role').notNull().default('member'),
    status: inviteStatusEnum('status').notNull().default('pending'),
    invitedById: uuid('invited_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  },
  (t) => [index('invites_workspace_idx').on(t.workspaceId)],
);

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('projects_workspace_slug_idx').on(t.workspaceId, t.slug)],
);

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  /** textkit's searchKey(title), kept in step with the title by the API. */
  searchKey: text('search_key').notNull(),
  status: taskStatusEnum('status').notNull().default('open'),
  assigneeId: uuid('assignee_id').references(() => users.id, { onDelete: 'set null' }),
  dueDate: timestamp('due_date', { withTimezone: true }),
  createdById: uuid('created_by_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: createdAt(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export const labels = pgTable(
  'labels',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    /** A hex colour, e.g. #d93f0b. */
    color: text('color').notNull(),
  },
  (t) => [uniqueIndex('labels_workspace_name_idx').on(t.workspaceId, t.name)],
);

export const taskLabels = pgTable(
  'task_labels',
  {
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    labelId: uuid('label_id')
      .notNull()
      .references(() => labels.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.taskId, t.labelId] })],
);

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    body: text('body').notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('comments_task_idx').on(t.taskId)],
);

export const attachments = pgTable(
  'attachments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    filename: text('filename').notNull(),
    url: text('url').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    uploadedById: uuid('uploaded_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [index('attachments_task_idx').on(t.taskId)],
);

export const activityEvents = pgTable(
  'activity_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    kind: activityKindEnum('kind').notNull(),
    actorId: uuid('actor_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('activity_workspace_at_idx').on(t.workspaceId, t.at, t.id)],
);

export const slackConnections = pgTable('slack_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .unique()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  status: slackStatusEnum('status').notNull().default('connected'),
  teamName: text('team_name').notNull(),
  /** AES-256-GCM, keyed by PLOTLINE_SECRET_KEY: iv.tag.ciphertext, base64url. */
  botTokenEncrypted: text('bot_token_encrypted').notNull(),
  createdAt: createdAt(),
});

/** express-session's store (connect-pg-simple's table layout). */
export const sessions = pgTable(
  'session',
  {
    sid: varchar('sid').primaryKey(),
    sess: json('sess').notNull(),
    expire: timestamp('expire', { precision: 6 }).notNull(),
  },
  (t) => [index('IDX_session_expire').on(t.expire)],
);
