import type { ValidationErrorBody } from '@plotline/shared';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(messageOf(body) ?? `Request failed (${status})`);
  }

  /** Field → message, for a 422. */
  get fieldErrors(): Record<string, string> {
    const errors = (this.body as Partial<ValidationErrorBody> | null)?.errors ?? [];
    return Object.fromEntries(errors.map((e) => [e.field, e.message]));
  }
}

function messageOf(body: unknown): string | undefined {
  if (body && typeof body === 'object' && 'message' in body) {
    const m = (body as { message: unknown }).message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m)) return m.join(', ');
  }
  return undefined;
}

/** Calls the API through the web app's /api proxy. Throws ApiError for any non-2xx. */
export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init;
  const res = await fetch(`/api${path}`, {
    credentials: 'same-origin',
    ...rest,
    headers: { ...(json !== undefined ? { 'content-type': 'application/json' } : {}), ...headers },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  if (res.status === 204) return undefined as T;
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}
