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

const StatusView = ({ state, port }: { state: State; port: number }) => {
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
              <UseCaseDisplay key={useCase.id} useCase={useCase} port={port} />
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

export const Dashboard = ({ port }: { port: number }) => {
  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    let ignore = false;
    setState(initialState);

    async function getSummary() {
      try {
        const response = await fetch(
          `http://localhost:${port}/api/analysis/summary`
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
  }, [port]);

  return <StatusView state={state} port={port} />;
};
