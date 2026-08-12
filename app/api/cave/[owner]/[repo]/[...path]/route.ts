import { getRepositoryPort, updateLastUsed } from '@/lib/repo-registry';

// Proxy dashboard requests to the cave process that listens on localhost of the server.
export async function GET(
  _request: Request,
  {
    params,
  }: { params: Promise<{ owner: string; repo: string; path: string[] }> }
) {
  const { owner, repo, path } = await params;

  let port: number;
  try {
    port = getRepositoryPort(owner, repo);
  } catch {
    return Response.json(
      { error: 'Cave session not found. Start a new one.' },
      { status: 404 }
    );
  }
  updateLastUsed(owner, repo);

  const url = `http://localhost:${port}/api/analysis/${path.map(encodeURIComponent).join('/')}`;
  let upstream: Response;
  try {
    upstream = await fetch(url);
  } catch {
    return Response.json({ error: 'Cave is not responding.' }, { status: 502 });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type':
        upstream.headers.get('content-type') ?? 'application/json',
    },
  });
}
