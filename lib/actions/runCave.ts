'use server';
import { runCaveOnDir } from '@/lib/cave';
import { fetchGithubRepo, getLatestCommitSha } from '@/lib/github';
import { type GitHubRepo, parseGithubUrl } from '@/lib/github-url';
import {
  getRepositoryCommitSha,
  hasRepository,
  removeRepository,
} from '@/lib/repo-registry';

// temporary place for repositories to live while latest commit sha are checked
const inFlight = new Map<string, Promise<GitHubRepo>>();

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
      return { owner, repo };
    }
    await removeRepository(owner, repo);
  }
  const tempDir = await fetchGithubRepo(owner, repo, commitSha);
  await runCaveOnDir(owner, repo, commitSha, tempDir);
  return { owner, repo };
}
