'use server';
import { runCaveOnDir } from '@/lib/cave';
import { CaveError, type SubmitRepoResult } from '@/lib/cave-error';
import { fetchGithubRepo, getLatestCommitSha } from '@/lib/github';
import { type GitHubRepo, parseGithubUrl } from '@/lib/github-url';
import {
  getRepositoryCommitSha,
  hasRepository,
  removeRepository,
  updateLastUsed,
} from '@/lib/repo-registry';

// temporary place for repositories to live while latest commit sha are checked
const inFlight = new Map<string, Promise<GitHubRepo>>();

export async function submitRepoUrl(url: string): Promise<SubmitRepoResult> {
  try {
    const { owner, repo } = await runCaveOnUrl(url);
    return { ok: true, owner, repo };
  } catch (error) {
    console.error(`Could not analyze ${url}:`, error);
    return {
      ok: false,
      code: error instanceof CaveError ? error.code : 'UNKNOWN',
    };
  }
}

export async function runCaveOnUrl(url: string): Promise<GitHubRepo> {
  const { owner, repo } = parseGithubUrl(url);
  const key = `${owner}/${repo}`;

  let task = inFlight.get(key);
  if (!task) {
    task = provisionRepo(owner, repo).finally(() => inFlight.delete(key));
    inFlight.set(key, task);
  }
  return task;
}

async function provisionRepo(owner: string, repo: string): Promise<GitHubRepo> {
  const commitSha = await getLatestCommitSha(owner, repo, 'HEAD');
  if (hasRepository(owner, repo)) {
    if (getRepositoryCommitSha(owner, repo) === commitSha) {
      updateLastUsed(owner, repo);
      return { owner, repo };
    }
    await removeRepository(owner, repo);
  }
  const tempDir = await fetchGithubRepo(owner, repo, commitSha);
  await runCaveOnDir(owner, repo, commitSha, tempDir);
  return { owner, repo };
}
