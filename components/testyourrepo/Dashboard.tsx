'use client';
import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { UseCaseDisplay } from './UseCaseDisplay';

type Interaction = {
  interaction_id: string;
  interaction_name: string;
};

export type UseCase = {
  id: string;
  name: string;
  violation_count: number;
  interactions: Interaction[];
};

type ProjectSummary = {
  project_name: string;
  total_use_cases: number;
  total_violations: number;
  use_cases: UseCase[];
};

type State =
  | { status: 'loading' }
  | { status: 'success'; data: ProjectSummary }
  | { status: 'error'; message: string };

const initialState: State = { status: 'loading' };

function assertStateNever(value: never): never {
  throw new Error(`Unexpected state: ${JSON.stringify(value)}`);
}

const StatusView = ({
  state,
  owner,
  repo,
}: {
  state: State;
  owner: string;
  repo: string;
}) => {
  switch (state.status) {
    case 'loading':
      return <p>Waiting for response...</p>;
    case 'success': {
      const useCasesSorted = [...state.data.use_cases].sort(
        (a, b) => b.violation_count - a.violation_count
      );
      return (
        <div className={styles.dashboard}>
          <h1 className="text-h1">
            Total Violations: {state.data.total_violations}
          </h1>
          <div className={styles.useCasesContainer}>
            {useCasesSorted.map((useCase) => (
              <UseCaseDisplay
                key={useCase.id}
                useCase={useCase}
                owner={owner}
                repo={repo}
              />
            ))}
          </div>
        </div>
      );
    }
    case 'error':
      return <p className={styles.errorMessage}>{state.message}</p>;
    default:
      return assertStateNever(state);
  }
};

export const Dashboard = ({ owner, repo }: { owner: string; repo: string }) => {
  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    let ignore = false;
    setState(initialState);

    async function getSummary() {
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
      try {
        const response = await fetch(
          `${base}/api/cave/${owner}/${repo}/summary`
        );
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'This session has expired. Start a new one.'
              : `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        if (!ignore) {
          setState({ status: 'success', data: data });
        }
      } catch (err) {
        if (!ignore) {
          setState({
            status: 'error',
            message:
              err instanceof Error ? err.message : 'Something went wrong.',
          });
        }
      }
    }

    getSummary();
    return () => {
      ignore = true;
    };
  }, [owner, repo]);

  return <StatusView state={state} owner={owner} repo={repo} />;
};
