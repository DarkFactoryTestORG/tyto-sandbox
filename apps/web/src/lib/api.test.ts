import { api, ApiError } from './api';

function respond(status: number, body: unknown) {
  return vi
    .fn()
    .mockResolvedValue(new Response(body === undefined ? null : JSON.stringify(body), { status }));
}

describe('api', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('calls the proxy and returns the JSON body', async () => {
    const fetch = respond(200, { id: 'w1' });
    vi.stubGlobal('fetch', fetch);
    expect(await api('/workspaces')).toEqual({ id: 'w1' });
    expect(fetch).toHaveBeenCalledWith(
      '/api/workspaces',
      expect.objectContaining({ credentials: 'same-origin' }),
    );
  });

  it('sends JSON bodies', async () => {
    const fetch = respond(201, {});
    vi.stubGlobal('fetch', fetch);
    await api('/tasks', { method: 'POST', json: { title: 'x' } });
    const init = fetch.mock.calls[0]![1] as RequestInit;
    expect(init.body).toBe('{"title":"x"}');
    expect(init.headers).toEqual({ 'content-type': 'application/json' });
  });

  it('turns a 422 into field errors', async () => {
    vi.stubGlobal(
      'fetch',
      respond(422, {
        statusCode: 422,
        message: 'Invalid title',
        errors: [{ field: 'title', message: 'Required' }],
      }),
    );
    const error = await api('/tasks').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).fieldErrors).toEqual({ title: 'Required' });
    expect((error as ApiError).message).toBe('Invalid title');
  });

  it('returns nothing for a 204', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
    expect(await api('/auth/logout', { method: 'POST' })).toBeUndefined();
  });
});
