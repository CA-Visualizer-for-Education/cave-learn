'use client';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { runCaveOnUrl } from '@/lib/actions/runCave';
import styles from './UrlInput.module.css';

type State =
  | { status: 'idle' }
  | { status: 'success'; owner: string; repo: string }
  | { status: 'error'; message: string };

const initialState: State = { status: 'idle' };

async function handleUrlSubmit(
  _prevState: State,
  formData: FormData
): Promise<State> {
  const rawUrl = formData.get('url');
  if (typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    return { status: 'error', message: 'Please enter a URL.' };
  }

  const url = rawUrl.trim();

  try {
    const { owner, repo } = await runCaveOnUrl(url);
    return { status: 'success', owner, repo };
  } catch (err) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Something went wrong.',
    };
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
