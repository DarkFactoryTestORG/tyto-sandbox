import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Injectable,
  Module,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { type Database, schema } from '@plotline/db';
import { type ConnectSlackInput, connectSlackSchema, type SlackConnection } from '@plotline/shared';
import { eq } from 'drizzle-orm';
import { AuthenticatedGuard } from '../auth/guards';
import { Roles, RolesGuard } from '../auth/roles';
import { decryptSecret, encryptSecret } from '../common/crypto';
import { ZodPipe } from '../common/zod.pipe';
import { APP_CONFIG, type AppConfig } from '../config';
import { InjectDb } from '../db.module';

const { slackConnections } = schema;

/** A workspace's Slack connection: the bot token, stored encrypted. Nothing sends messages yet. */
@Injectable()
export class SlackService {
  constructor(
    @InjectDb() private readonly db: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  async get(workspaceId: string): Promise<SlackConnection> {
    const row = await this.db.query.slackConnections.findFirst({
      where: eq(slackConnections.workspaceId, workspaceId),
    });
    if (!row) throw new NotFoundException('Slack is not connected');
    return view(row);
  }

  async connect(workspaceId: string, input: ConnectSlackInput): Promise<SlackConnection> {
    const values = {
      workspaceId,
      teamName: input.teamName,
      status: 'connected' as const,
      botTokenEncrypted: encryptSecret(input.botToken, this.config.secretKey),
    };
    const [row] = await this.db
      .insert(slackConnections)
      .values(values)
      .onConflictDoUpdate({ target: slackConnections.workspaceId, set: values })
      .returning();
    return view(row!);
  }

  async disconnect(workspaceId: string): Promise<void> {
    await this.db.delete(slackConnections).where(eq(slackConnections.workspaceId, workspaceId));
  }

  /** The decrypted bot token of a connected workspace, or undefined. */
  async botToken(workspaceId: string): Promise<string | undefined> {
    const row = await this.db.query.slackConnections.findFirst({
      where: eq(slackConnections.workspaceId, workspaceId),
    });
    if (!row || row.status !== 'connected') return undefined;
    return decryptSecret(row.botTokenEncrypted, this.config.secretKey);
  }
}

function view(row: typeof slackConnections.$inferSelect): SlackConnection {
  return { status: row.status, teamName: row.teamName, connectedAt: row.createdAt.toISOString() };
}

@Controller('workspaces/:workspaceId/slack')
@UseGuards(AuthenticatedGuard, RolesGuard)
export class SlackController {
  constructor(private readonly slack: SlackService) {}

  @Get()
  @Roles('viewer')
  get(@Param('workspaceId') workspaceId: string): Promise<SlackConnection> {
    return this.slack.get(workspaceId);
  }

  @Put()
  @Roles('admin')
  connect(
    @Param('workspaceId') workspaceId: string,
    @Body(new ZodPipe(connectSlackSchema)) body: ConnectSlackInput,
  ): Promise<SlackConnection> {
    return this.slack.connect(workspaceId, body);
  }

  @Delete()
  @Roles('admin')
  @HttpCode(204)
  disconnect(@Param('workspaceId') workspaceId: string): Promise<void> {
    return this.slack.disconnect(workspaceId);
  }
}

@Module({ controllers: [SlackController], providers: [SlackService], exports: [SlackService] })
export class SlackModule {}
