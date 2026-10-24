// Same-origin proxy to the API, so the session cookie (and the dev auth cookie) are first-party.
// API_URL is read per request, so one image works in every environment.
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const HOP_BY_HOP = ['connection', 'keep-alive', 'transfer-encoding', 'upgrade', 'host', 'content-length'];

function apiUrl(): string {
  return (process.env.API_URL ?? 'http://localhost:4000').replace(/\/$/, '');
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const { path } = await ctx.params;
  const target = `${apiUrl()}/${path.map(encodeURIComponent).join('/')}${req.nextUrl.search}`;
  const headers = new Headers(req.headers);
  for (const h of HOP_BY_HOP) headers.delete(h);
  headers.set('x-forwarded-proto', req.nextUrl.protocol.replace(':', ''));
  headers.set('x-forwarded-host', req.headers.get('host') ?? '');
  const hasBody = !['GET', 'HEAD'].includes(req.method);
  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
      redirect: 'manual',
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json({ statusCode: 502, message: 'The API is unreachable' }, { status: 502 });
  }
  const out = new Headers();
  upstream.headers.forEach((value, key) => {
    if (key !== 'set-cookie' && key !== 'content-encoding' && !HOP_BY_HOP.includes(key)) out.set(key, value);
  });
  for (const cookie of upstream.headers.getSetCookie()) out.append('set-cookie', cookie);
  return new NextResponse(upstream.status === 204 ? null : upstream.body, {
    status: upstream.status,
    headers: out,
  });
}

export { proxy as DELETE, proxy as GET, proxy as PATCH, proxy as POST, proxy as PUT };
