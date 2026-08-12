import 'server-only';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream } from 'node:stream/web';
import * as tar from 'tar';
import { CaveError } from '@/lib/cave-error';

export async function getLatestCommitSha(
  owner: string,
  repo: string,
  ref: string
): Promise<string> {
  const commitInfoResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits/${ref}`
  );
  if (!commitInfoResponse.ok) {
    throw new CaveError(
      'REPO_UNAVAILABLE',
      `Fetching sha of HEAD of repository ${repo} with owner ${owner} failed: ${commitInfoResponse.status}`
    );
  }
  return (await commitInfoResponse.json()).sha;
}

export async function fetchGithubRepo(
  owner: string,
  repo: string,
  commitSha: string
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/tarball/${commitSha}`
  );
  if (!response.ok || !response.body) {
    throw new CaveError(
      'REPO_UNAVAILABLE',
      `Failed to download tarball from ${repo} with owner ${owner}: ${response.status}`
    );
  }

  const tempDir = await mkdtemp(join(tmpdir(), 'cave-learn-'));
  try {
    await pipeline(
      Readable.fromWeb(response.body as unknown as ReadableStream<Uint8Array>),
      tar.extract({ cwd: tempDir, strip: 1 })
    );
  } catch (err) {
    await rm(tempDir, { recursive: true, force: true });
    throw err;
  }

  return tempDir;
}
