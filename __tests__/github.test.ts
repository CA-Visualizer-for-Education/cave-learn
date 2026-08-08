import { parseGithubUrl } from '@/lib/github-url';

describe('parseGithubUrl', () => {
  it('extracts owner and repo', () => {
    expect(parseGithubUrl('https://github.com/owner/repo')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('strips trailing .git', () => {
    expect(parseGithubUrl('https://github.com/owner/repo.git')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('ignores trailing url path segments', () => {
    expect(parseGithubUrl('https://github.com/owner/repo/tree/main')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('host is not case-sensitive', () => {
    expect(parseGithubUrl('https://GitHub.com/owner/repo')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it.each([
    'https://evil.com/evil-owner/evil-repo',
    'https://gitlab.com/owner/repo',
  ])('rejects non-github hosts: %s', (url) => {
    expect(() => parseGithubUrl(url)).toThrow(/not a github repository/i);
  });

  it.each([
    'https://github.com/owner',
    'https://github.com/',
    'https://github.com/owner/',
  ])('rejects urls missing owner or repo: %s', (url) => {
    expect(() => parseGithubUrl(url)).toThrow(/invalid github repository/i);
  });

  it('rejects url with invalid characters', () => {
    expect(() => parseGithubUrl('https://github.com/ow ner/repo')).toThrow(
      /invalid github repository/i
    );
  });

  it('throws on a non-url string', () => {
    expect(() => parseGithubUrl('not a url')).toThrow();
  });
});
