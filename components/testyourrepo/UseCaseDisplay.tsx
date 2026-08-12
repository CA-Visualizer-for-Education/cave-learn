import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useState } from 'react';
import type { UseCase } from './Dashboard.tsx';
import styles from './UseCaseDisplay.module.css';

type FileContext = {
  file: string;
  snippet: string;
  line_number: number;
};

type Violation = {
  id: string;
  type: string;
  message: string;
  suggestion: string;
  related_node_ids: string[];
  related_edge_id: string;
  file_context: FileContext;
};

type UseCaseDisplayProps = {
  useCase: UseCase;
  owner: string;
  repo: string;
};

export const UseCaseDisplay = ({
  useCase,
  owner,
  repo,
}: UseCaseDisplayProps) => {
  const [violations, setViolations] = useState<Violation[] | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error;
  }

  function toggleViolations() {
    if (isLoading) {
      return;
    }
    if (expanded) {
      setExpanded(false);
    } else if (violations) {
      setExpanded(true);
    } else {
      getViolations();
    }
  }

  function summaryContent() {
    if (isLoading) {
      return (
        <span className={styles.gettingViolations}>Getting violations...</span>
      );
    }
    if (useCase.violation_count === 0) {
      return `${useCase.name} has no violations.`;
    }
    return (
      <span>
        {useCase.name} has{' '}
        <span className={styles.violationNumber}>
          {useCase.violation_count}
        </span>{' '}
        violations.
      </span>
    );
  }

  async function getViolations(): Promise<void> {
    setIsLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
      const response = await fetch(
        `${base}/api/cave/${owner}/${repo}/violations/${encodeURIComponent(useCase.id)}`
      );
      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? 'This session has expired. Start a new one.'
            : `HTTP ${response.status}: ${response.statusText}`
        );
      }
      setViolations(await response.json());
      setExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Something went wrong.'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Accordion
      disabled={useCase.violation_count === 0}
      disableGutters
      expanded={expanded}
      onChange={toggleViolations}
      sx={{
        color: 'var(--color-text)',
        backgroundColor: 'var(--color-surface2)',
        border: '0px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        '&::before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {summaryContent()}
      </AccordionSummary>
      <AccordionDetails
        sx={{
          paddingTop: '0px',
        }}
      >
        <div className={styles.violationContainer}>
          {violations?.map((violation) => (
            <div key={violation.id} className={styles.violationCard}>
              <p className={styles.violationDescription}>
                Violation of type "{violation.type}" in{' '}
                <span className={styles.violationFileName}>
                  {violation.file_context.file}
                </span>{' '}
                at line {violation.file_context.line_number}:
              </p>
              <p className={`text-mono ${styles.violationSnippet}`}>
                {violation.file_context.snippet}
              </p>
              {violation.message && (
                <p className={styles.violationExtraInfo}>
                  Message: {violation.message}
                </p>
              )}
              {violation.suggestion !== '' && (
                <p className={styles.violationExtraInfo}>
                  Suggestion: {violation.suggestion}
                </p>
              )}
            </div>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
