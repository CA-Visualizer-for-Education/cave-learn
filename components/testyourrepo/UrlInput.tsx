'use client';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { submitRepoUrl } from '@/lib/actions/runCave';
import type { CaveErrorCode } from '@/lib/cave-error';
import styles from './UrlInput.module.css';

type State =
  | { status: 'idle' }
  | { status: 'success'; owner: string; repo: string }
  | { status: 'error'; message: string };

const initialState: State = { status: 'idle' };

const errorMessages: Record<CaveErrorCode, string> = {
  INVALID_URL:
    'Enter a GitHub repository URL, like https://github.com/owner/repo.',
  REPO_UNAVAILABLE:
    'Could not read that repository. Make sure it exists and is public.',
  ANALYSIS_FAILED: 'Could not analyze that repository. Please try again.',
  UNKNOWN: 'Something went wrong. Please try again.',
};

async function handleUrlSubmit(
  _prevState: State,
  formData: FormData
): Promise<State> {
  const rawUrl = formData.get('url');
  if (typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    return { status: 'error', message: 'Please enter a URL.' };
  }

  try {
    const result = await submitRepoUrl(rawUrl.trim());
    if (result.ok) {
      return { status: 'success', owner: result.owner, repo: result.repo };
    }
    return { status: 'error', message: errorMessages[result.code] };
  } catch {
    return { status: 'error', message: errorMessages.UNKNOWN };
  }
}
export const UrlInput = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    handleUrlSubmit,
    initialState
  );

  useEffect(() => {
    if (state.status === 'success') {
      router.push(`/testyourrepo/${state.owner}/${state.repo}`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className={styles.root}>
      <div className={styles.inputGroup}>
        <input
          className={styles.input}
          type="url"
          name="url"
          placeholder="https://github.com/user/repo"
          required
        />
        <button
          className={`btn btn--primary ${styles.button}`}
          type="submit"
          disabled={isPending}
        >
          {isPending ? 'Analyzing...' : 'Analyze Repo'}
        </button>
      </div>
      {state.status === 'error' && (
        <p className={styles.errorMessage}>{state.message}</p>
      )}
    </form>
  );
};
