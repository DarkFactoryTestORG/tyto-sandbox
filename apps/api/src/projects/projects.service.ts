import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { type Database, schema } from '@plotline/db';
import type { CreateProjectInput, Project } from '@plotline/shared';
import { slugify } from '@plotline/textkit';
import { and, asc, eq, like } from 'drizzle-orm';
import type { AuthUser } from '../auth/auth-user';
import { toProject } from '../common/views';
import { InjectDb } from '../db.module';

const { projects, memberships } = schema;

@Injectable()
export class ProjectsService {
  constructor(@InjectDb() private readonly db: Database) {}

  async list(user: AuthUser, workspaceId: string): Promise<Project[]> {
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Workspace not found');

    const rows = await this.db
      .select()
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId))
      .orderBy(asc(projects.name));
    return rows.map(toProject);
  }

  async create(user: AuthUser, workspaceId: string, input: Required<CreateProjectInput>): Promise<Project> {
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Workspace not found');
    if (membership.role === 'viewer') throw new ForbiddenException('Viewers cannot create projects');

    const slug = await this.freeSlug(workspaceId, slugify(input.name) || 'project');
    const [row] = await this.db
      .insert(projects)
      .values({ workspaceId, slug, ...input })
      .returning();
    return toProject(row!);
  }

  async get(user: AuthUser, projectId: string): Promise<Project> {
    const project = await this.db.query.projects.findFirst({ where: eq(projects.id, projectId) });
    if (!project) throw new NotFoundException('Project not found');
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, project.workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Project not found');

    return toProject(project);
  }

  async bySlug(user: AuthUser, workspaceId: string, slug: string): Promise<Project> {
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Project not found');

    const project = await this.db.query.projects.findFirst({
      where: and(eq(projects.workspaceId, workspaceId), eq(projects.slug, slug)),
    });
    if (!project) throw new NotFoundException('Project not found');
    return toProject(project);
  }

  /** `base`, else `base-2`, `base-3`, … */
  private async freeSlug(workspaceId: string, base: string): Promise<string> {
    const taken = new Set(
      (
        await this.db
          .select({ slug: projects.slug })
          .from(projects)
          .where(and(eq(projects.workspaceId, workspaceId), like(projects.slug, `${base}%`)))
      ).map((r) => r.slug),
    );
    if (!taken.has(base)) return base;
    for (let n = 2; ; n++) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
  }
}
