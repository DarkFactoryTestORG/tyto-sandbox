/** An opaque keyset cursor: the sort position of the last item on a page. */
export interface Position {
  at: string;
  id: string;
}

export function encodeCursor(p: Position): string {
  return Buffer.from(JSON.stringify([p.at, p.id])).toString('base64url');
}

/** The position, or undefined for a cursor this API did not make. */
export function decodeCursor(cursor: string): Position | undefined {
  try {
    const value: unknown = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    if (Array.isArray(value) && value.length === 2 && value.every((v) => typeof v === 'string')) {
      const [at, id] = value as [string, string];
      if (!Number.isNaN(Date.parse(at))) return { at, id };
    }
  } catch {
    // fall through
  }
  return undefined;
}
