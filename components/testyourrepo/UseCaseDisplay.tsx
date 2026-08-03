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
  port: number;
};

export const UseCaseDisplay = ({ useCase, port }: UseCaseDisplayProps) => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function toggleViolations() {
    expanded ? setExpanded(false) : getViolations();
  }

  async function getViolations(): Promise<void> {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:${port}/api/analysis/violations/${useCase.id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      setViolations(await response.json());
      setExpanded(true);
    } catch (err) {
      console.error(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
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
        {useCase.violation_count !== 0 ? (
          <span>
            {useCase.name} has{' '}
            <span className={styles.violationNumber}>
              {useCase.violation_count}
            </span>{' '}
            violations.
          </span>
        ) : (
          `${useCase.name} has no violations.`
        )}
      </AccordionSummary>
      <AccordionDetails
        sx={{
          paddingTop: '0px',
        }}
      >
        {isLoading ? (
          <div className={styles.gettingViolations}>Getting violations...</div>
        ) : (
          <div className={styles.violationContainer}>
            {violations.map((violation) => (
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
        )}
      </AccordionDetails>
    </Accordion>
  );
};
