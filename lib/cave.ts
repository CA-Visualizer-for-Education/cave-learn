import 'server-only';
import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { addRepository } from '@/lib/repo-registry';

const timeoutMs = 10000;

function getCavePort(cave: ChildProcess): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!cave.stdout) {
      throw new Error('cave.stdout is null');
    }
    const rl = createInterface({ input: cave.stdout });

    const cleanUp = () => {
      clearTimeout(timer);
      rl.close();
      cave.off('exit', onExit);
      cave.off('error', onError);
    };

    const onExit = (code: number | null, signal: NodeJS.Signals | null) => {
      cleanUp();
      reject(
        new Error(
          `cave exited before reporting port (code=${code}, signal=${signal})`
        )
      );
    };
    const onError = (err: Error) => {
      cleanUp();
      reject(err);
    };

    const timer = setTimeout(() => {
      cleanUp();
      reject(new Error('Timed out waiting for cave to provide port number'));
    }, timeoutMs);

    cave.once('exit', onExit);
    cave.once('error', onError);

    rl.on('line', (line) => {
      const match = line.match(/http:\/\/localhost:(\d+)/);
      if (match) {
        cleanUp();
        resolve(parseInt(match[1], 10));
      }
    });
  });
}

export async function runCaveOnDir(
  owner: string,
  repo: string,
  commitSha: string,
  tempDir: string
): Promise<void> {
  const cave = spawn('cave', ['start', '--backend-only'], {
    cwd: tempDir,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  try {
    const port = await getCavePort(cave);
    addRepository(owner, repo, commitSha, port, cave, tempDir);
  } catch (error) {
    cave.kill('SIGTERM'); // TODO: more robust termination
    await rm(tempDir, { recursive: true, force: true });
    throw new Error(
      `Could not remove repository at ${tempDir}: ${(error as Error).message}`
    );
  }
}
