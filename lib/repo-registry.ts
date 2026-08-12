/*
 * In-memory implementation to keep track of existing repositories.
 * At the moment, there is no upper limit on how many repositories (hence cave processes) can be alive concurrently.
 * In the future, consider imposing such limit if necessary.
 */
import 'server-only';
import type { ChildProcess } from 'node:child_process';
import { rmSync } from 'node:fs';
import { rm } from 'node:fs/promises';

type RepoInstance = {
  dir: string;
  cavePort: number;
  caveProcess: ChildProcess;
  commitSha: string;
  lastUsed: number;
};

/* Number of hours a repository is guaranteed to be alive starting from the time it was last used. */
const repoMaxAge = 3;
/* Number of minutes of the interval which {@link cleanRegistry} will be called. */
const cleanInterval = 10;

const globalForRepoRegistry = globalThis as {
  __repoRegistry?: Map<string, RepoInstance>;
  __repoReaper?: NodeJS.Timeout;
  __repoExitHooked?: boolean;
};

if (!globalForRepoRegistry.__repoRegistry) {
  globalForRepoRegistry.__repoRegistry = new Map();
}

const repositories: Map<string, RepoInstance> =
  globalForRepoRegistry.__repoRegistry;

if (!globalForRepoRegistry.__repoReaper) {
  globalForRepoRegistry.__repoReaper = setInterval(
    cleanRegistry,
    cleanInterval * 60000
  );
  globalForRepoRegistry.__repoReaper.unref();
}

const exitCodes = {
  SIGINT: 130,
  SIGTERM: 143,
  SIGHUP: 129,
} as const;

// To forcefully quit the program, press Ctrl+c twice.
if (!globalForRepoRegistry.__repoExitHooked) {
  globalForRepoRegistry.__repoExitHooked = true;
  process.on('exit', emptyRegistry);
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) {
    process.once(signal, () => process.exit(exitCodes[signal]));
  }
}

/*
 * Remove all repositories from the registry. To be called when the process exits.
 */
function emptyRegistry() {
  if (repositories.size > 0) {
    console.log(`Cleaning up ${repositories.size} repositories before exit...`);
  }
  for (const [key, repo] of repositories) {
    try {
      repo.caveProcess.kill('SIGTERM');
    } catch {}
    try {
      rmSync(repo.dir, { recursive: true, force: true });
    } catch {}
    repositories.delete(key);
  }
}

/*
 * Clean repository registry, removing repositories older than {@link repoMaxAge}
 */
async function cleanRegistry(): Promise<void> {
  for (const [key, repo] of repositories) {
    if (Date.now() - repo.lastUsed >= repoMaxAge * 3600000) {
      try {
        await deleteRepository(key, repo);
      } catch (error) {
        console.error(error);
      }
    }
  }
}

function makeKey(owner: string, repo: string) {
  return `${owner}/${repo}`;
}

export function addRepository(
  owner: string,
  repo: string,
  commitSha: string,
  port: number,
  cave: ChildProcess,
  tempDir: string
) {
  repositories.set(makeKey(owner, repo), {
    dir: tempDir,
    cavePort: port,
    caveProcess: cave,
    commitSha: commitSha,
    lastUsed: Date.now(),
  });
}

export function updateLastUsed(owner: string, repo: string) {
  const entry = getRepository(owner, repo);
  entry.lastUsed = Date.now();
}

export function hasRepository(owner: string, repo: string): boolean {
  return repositories.has(makeKey(owner, repo));
}

export function getRepository(owner: string, repo: string): RepoInstance {
  const entry = repositories.get(makeKey(owner, repo));
  if (!entry) {
    throw new Error(`Repository ${repo} with owner ${owner} does not exist`);
  }
  return entry;
}

export function getRepositoryCommitSha(owner: string, repo: string): string {
  const entry = getRepository(owner, repo);
  return entry.commitSha;
}

export function getRepositoryPort(owner: string, repo: string): number {
  const entry = getRepository(owner, repo);
  return entry.cavePort;
}

async function deleteRepository(key: string, repo: RepoInstance) {
  try {
    repo.caveProcess.kill('SIGTERM'); // TODO: more robust termination
    await rm(repo.dir, { recursive: true, force: true });
  } catch (error) {
    throw new Error(
      `Could not remove repository at ${repo.dir}: ${(error as Error).message}`
    );
  } finally {
    repositories.delete(key);
  }
}
export async function removeRepository(owner: string, repo: string) {
  await deleteRepository(makeKey(owner, repo), getRepository(owner, repo));
}
