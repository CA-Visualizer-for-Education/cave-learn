import { runCaveOnUrl } from '@/lib/actions/runCave';
import * as cave from '@/lib/cave';
import * as github from '@/lib/github';
import * as registry from '@/lib/repo-registry';

jest.mock('@/lib/github', () => ({
  getLatestCommitSha: jest.fn(),
  fetchGithubRepo: jest.fn(),
}));
jest.mock('@/lib/cave', () => ({ runCaveOnDir: jest.fn() }));
jest.mock('@/lib/repo-registry', () => ({
  hasRepository: jest.fn(),
  getRepositoryCommitSha: jest.fn(),
  removeRepository: jest.fn(),
}));

const getLatestCommitSha = jest.mocked(github.getLatestCommitSha);
const fetchGithubRepo = jest.mocked(github.fetchGithubRepo);
const runCaveOnDir = jest.mocked(cave.runCaveOnDir);
const hasRepository = jest.mocked(registry.hasRepository);
const getRepositoryCommitSha = jest.mocked(registry.getRepositoryCommitSha);
const removeRepository = jest.mocked(registry.removeRepository);

const URL_A = 'https://github.com/owner/repo-a';
const URL_B = 'https://github.com/owner/repo-b';

describe('runCaveOnUrl', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    hasRepository.mockReturnValue(false);
    getLatestCommitSha.mockResolvedValue('sha1');
    fetchGithubRepo.mockResolvedValue('/tmp/cave-learn-xxxx');
    runCaveOnDir.mockResolvedValue(undefined);
  });

  it('deduplicates concurrent requests for the same repo', async () => {
    const { promise, resolve } = Promise.withResolvers<string>();
    getLatestCommitSha.mockReturnValue(promise);

    const p1 = runCaveOnUrl(URL_A);
    const p2 = runCaveOnUrl(URL_A);
    resolve('sha1');
    const [result1, result2] = await Promise.all([p1, p2]);

    expect(result1).toEqual({ owner: 'owner', repo: 'repo-a' });
    expect(result2).toEqual({ owner: 'owner', repo: 'repo-a' });
    expect(getLatestCommitSha).toHaveBeenCalledTimes(1);
    expect(fetchGithubRepo).toHaveBeenCalledTimes(1);
    expect(runCaveOnDir).toHaveBeenCalledTimes(1);
  });

  it('handles distinct repos independently', async () => {
    const [resultA, resultB] = await Promise.all([
      runCaveOnUrl(URL_A),
      runCaveOnUrl(URL_B),
    ]);

    expect(resultA).toEqual({ owner: 'owner', repo: 'repo-a' });
    expect(resultB).toEqual({ owner: 'owner', repo: 'repo-b' });

    expect(getLatestCommitSha).toHaveBeenCalledWith('owner', 'repo-a', 'HEAD');
    expect(getLatestCommitSha).toHaveBeenCalledWith('owner', 'repo-b', 'HEAD');
  });

  it('reuses an existing repo when the latest commit sha matches', async () => {
    hasRepository.mockReturnValue(true);
    getRepositoryCommitSha.mockReturnValue('sha1');
    getLatestCommitSha.mockResolvedValue('sha1');

    const result = await runCaveOnUrl(URL_A);

    expect(result).toEqual({ owner: 'owner', repo: 'repo-a' });
    expect(removeRepository).not.toHaveBeenCalled();
    expect(fetchGithubRepo).not.toHaveBeenCalled();
    expect(runCaveOnDir).not.toHaveBeenCalled();
  });

  it('removes and re-fetches the repo when the cached sha is stale', async () => {
    hasRepository.mockReturnValue(true);
    getRepositoryCommitSha.mockReturnValue('old-sha');
    getLatestCommitSha.mockResolvedValue('new-sha');
    removeRepository.mockResolvedValue(undefined);

    await runCaveOnUrl(URL_A);

    expect(removeRepository).toHaveBeenCalledWith('owner', 'repo-a');
    expect(fetchGithubRepo).toHaveBeenCalledWith('owner', 'repo-a', 'new-sha');
    expect(runCaveOnDir).toHaveBeenCalledTimes(1);
  });

  it('starts a fresh run once the in-flight entry clears', async () => {
    await runCaveOnUrl(URL_A);
    await runCaveOnUrl(URL_A);

    expect(getLatestCommitSha).toHaveBeenCalledTimes(2);
  });

  it('allows a retry after a failed attempt', async () => {
    getLatestCommitSha
      .mockRejectedValueOnce(new Error('bad error'))
      .mockResolvedValueOnce('sha1');

    await expect(runCaveOnUrl(URL_A)).rejects.toThrow('bad error');

    expect(fetchGithubRepo).not.toHaveBeenCalled();
    expect(runCaveOnDir).not.toHaveBeenCalled();

    await expect(runCaveOnUrl(URL_A)).resolves.toEqual({
      owner: 'owner',
      repo: 'repo-a',
    });
    expect(getLatestCommitSha).toHaveBeenCalledTimes(2);
    expect(fetchGithubRepo).toHaveBeenCalledTimes(1);
    expect(runCaveOnDir).toHaveBeenCalledTimes(1);
  });
});
