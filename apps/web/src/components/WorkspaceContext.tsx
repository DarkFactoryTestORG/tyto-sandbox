'use client';
import type { Member, User, Workspace } from '@plotline/shared';
import { createContext, useContext } from 'react';

export interface WorkspaceContextValue {
  workspace: Workspace;
  me: User;
  members: Member[];
  /** False for viewers: they see everything and change nothing. */
  canEdit: boolean;
  reloadMembers: () => void;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): WorkspaceContextValue {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error('useWorkspace must be used under /w/[workspaceSlug]');
  return value;
}
