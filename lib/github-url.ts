import { CaveError } from '@/lib/cave-error';

export type GitHubRepo = { owner: string; repo: string };

export function parseGithubUrl(url: string): GitHubRepo {
  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch {
    throw new CaveError('INVALID_URL', `Invalid GitHub repository URL: ${url}`);
  }
  if (urlObj.hostname !== 'github.com') {
    throw new CaveError('INVALID_URL', `Not a GitHub repository: ${url}`);
  }
  const [, owner, rawRepo] = urlObj.pathname.split('/');
  const repo = rawRepo?.replace(/\.git$/, '');
  const validSegment = /^[\w.-]+$/;
  if (
    !owner ||
    !repo ||
    !validSegment.test(owner) ||
    !validSegment.test(repo)
  ) {
    throw new CaveError('INVALID_URL', `Invalid GitHub repository URL: ${url}`);
  }

  return { owner, repo };
}
