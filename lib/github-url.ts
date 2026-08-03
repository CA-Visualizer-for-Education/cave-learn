export type GitHubRepo = { owner: string; repo: string };

export function parseGithubUrl(url: string): GitHubRepo {
  const urlObj = new URL(url);
  if (urlObj.hostname !== 'github.com') {
    throw new Error(`Not a GitHub repository: ${url}`);
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
    throw new Error(`Invalid GitHub repository URL: ${url}`);
  }

  return { owner, repo };
}
