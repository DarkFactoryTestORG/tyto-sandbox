import { z } from 'zod';
import { isCalendarDate, isTimeZone } from './dates';
import { ROLES } from './roles';

export const roleSchema = z.enum(ROLES);
const calendarDate = z.string().refine(isCalendarDate, 'must be a date in YYYY-MM-DD form');

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    timezone: z.string().refine(isTimeZone, 'must be an IANA time zone, e.g. Europe/London'),
    avatarUrl: z.string().url().nullable(),
    slackUserId: z
      .string()
      .regex(/^U[A-Z0-9]{2,}$/, 'must be a Slack user id, e.g. U0123')
      .nullable(),
  })
  .partial();
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().max(2000).default(''),
});
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(10_000).default(''),
  assigneeId: z.string().uuid().nullable().default(null),
  dueDate: calendarDate.nullable().default(null),
  labelIds: z.array(z.string().uuid()).max(20).default([]),
});
export type CreateTaskInput = z.input<typeof createTaskSchema>;

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().max(10_000),
    assigneeId: z.string().uuid().nullable(),
    dueDate: calendarDate.nullable(),
    labelIds: z.array(z.string().uuid()).max(20),
  })
  .partial();
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(5000),
});
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const createInviteSchema = z.object({
  email: z
    .string()
    .email()
    .transform((e) => e.toLowerCase()),
  role: roleSchema.exclude(['owner']).default('member'),
});
export type CreateInviteInput = z.input<typeof createInviteSchema>;

export const updateMemberSchema = z.object({
  role: roleSchema.exclude(['owner']),
});
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

export const connectSlackSchema = z.object({
  teamName: z.string().trim().min(1).max(100),
  botToken: z.string().regex(/^xoxb-[\w-]+$/, 'must be a Slack bot token (xoxb-…)'),
});
export type ConnectSlackInput = z.infer<typeof connectSlackSchema>;

export const taskListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
  status: z.enum(['open', 'done']).optional(),
  q: z.string().max(200).optional(),
});
export type TaskListQuery = z.infer<typeof taskListQuerySchema>;

export const activityQuerySchema = z.object({
  cursor: z.string().max(200).optional(),
  actorId: z.string().uuid().optional(),
});
export type ActivityQuery = z.infer<typeof activityQuerySchema>;

/** The body of every 422: one entry per invalid field. */
export interface ValidationErrorBody {
  statusCode: 422;
  message: string;
  errors: { field: string; message: string }[];
}
