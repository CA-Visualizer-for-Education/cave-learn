// components/exercise/ExerciseBoardSidebar/ExerciseBoardSidebar.tsx
// The sidebar of the exercise page.

'use client';
import { useDroppable } from '@dnd-kit/react';
import { CA_COMPONENTS } from '@/lib/ca-data';
import { ComponentPieces } from '../ComponentPieces/ComponentPieces';
import styles from './ExerciseBoardSidebar.module.css';

/*
  isPlaced maps button ids -> droppable area ids
    - shows the area each button is in
  isVerified: Whether or not the current board has been verified (check work has been clicked).
  score: The amount of draggable buttons in the correct droppable areas.
  handleReset: Resets the position of all of the draggable pieces after the board has been verified.
  handleRetry: Reset the position of all of the draggable pieces.
  handleCheckWork: Shows the score and triggers a change in the sidebar.
*/
interface ExerciseBoardSidebarProps {
  isPlaced: Record<string, string>;
  isVerified: boolean;
  score: number;
  handleReset(): void;
  handleRetry(): void;
  handleCheckWork(): void;
}

export default function ExerciseBoardSidebar({
  isPlaced,
  isVerified,
  score,
  handleReset,
  handleRetry,
  handleCheckWork,
}: ExerciseBoardSidebarProps) {
  const { ref: sidebarDroppableRef } = useDroppable({
    id: 'sidebar-droppable',
  });

  return (
    <>
      {isVerified ? (
        <div className={styles['sidebar--verified--container']}>
          <div className={styles['sidebar--results-text']}>
            <div className={styles['results--circle']}></div>
            <p className={`text-eyebrow ${styles['results-text']}`}>RESULTS</p>
          </div>
          <div className={styles['sidebar--circle--container']}>
            <svg
              className={styles['sidebar--circle-ring']}
              viewBox="0 0 100 100"
              role="img"
              aria-label={`Score: ${score} out of ${CA_COMPONENTS.length}`}
            >
              <circle
                stroke="#e6e6e6"
                strokeWidth="8"
                fill="transparent"
                r="45"
                cx="50%"
                cy="50%"
              />
              <circle
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: 100 - (score / CA_COMPONENTS.length) * 100,
                }}
                pathLength="100"
                stroke="var(--color-brand-green)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                r="45"
                cx="50%"
                cy="50%"
              />
            </svg>
            <div className={styles['score-description--container']}>
              <div>
                <span className={styles['score-text']}>{score}</span>
                <span className={styles['max-score-text']}>
                  /{CA_COMPONENTS.length}
                </span>
              </div>
              {score / CA_COMPONENTS.length > 0.75 && (
                <p className={styles['score-description-good']}>
                  {score === CA_COMPONENTS.length ? 'PERFECT' : 'NICE'}
                </p>
              )}
            </div>
          </div>
          <div className={styles['sidebar--incorrect-components-title']}>
            {CA_COMPONENTS.some(
              (component) => isPlaced[component.id] !== component.id
            ) && (
              <h2
                className={`text-h2 ${styles['incorrect-components--header']}`}
              >
                Incorrect Components
              </h2>
            )}
          </div>
          <div className={styles['sidebar--incorrect-components']}>
            {CA_COMPONENTS.filter(
              (component) => isPlaced[component.id] !== component.id
            ).map((component) => (
              <ComponentPieces
                key={component.id}
                label={component.id}
                layer={component.layer}
                currentLayer={''}
                verificationStatus={'verified-incorrect'}
              />
            ))}
          </div>
          <div className={styles['retry-button--container']}>
            <button
              className={`btn btn--primary ${styles['retry-button']}`}
              type="button"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <aside className={styles['sidebar--container']}>
          <div className={styles['pieces--container']}>
            <p>PIECES</p>
          </div>
          <div className={styles['description--container']}>
            <p className={styles['description-text']}>
              Drag each chip into the slot you think it belongs in. Drop chips
              back here to remove.
            </p>
          </div>
          <div
            className={styles['buttons--container']}
            ref={sidebarDroppableRef}
          >
            {CA_COMPONENTS.filter(
              (component) => isPlaced[component.id] === ''
            ).map((component) => (
              <ComponentPieces
                key={component.id}
                label={component.id}
                layer={component.layer}
                currentLayer={isPlaced[component.id]}
                verificationStatus={'unverified'}
              />
            ))}
          </div>
          <div className={styles['check-work-reset--container']}>
            <button
              className={`btn btn--primary ${styles['btn--check-work']} ${CA_COMPONENTS.some((component) => isPlaced[component.id] === '') && styles['btn--check-work--incomplete-diagram']}`}
              onClick={handleCheckWork}
              type="button"
            >
              Check My Work
            </button>
            <button
              className={`btn btn--secondary ${styles['btn--reset']}`}
              onClick={handleReset}
              type="button"
            >
              Reset
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
