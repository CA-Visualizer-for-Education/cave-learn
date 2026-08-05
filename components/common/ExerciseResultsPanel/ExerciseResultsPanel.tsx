// components/common/ExerciseResultsPanel/ExerciseResultsPanel.tsx
// The results view shown in an exercise sidebar after the board has been verified.
// Extracted from ExerciseBoardSidebar so the matching exercise can reuse it.
import { Children, type ReactNode } from "react";
import styles from "./ExerciseResultsPanel.module.css";

/*
  score: The amount of answers the learner got right.
  total: The amount of answers on the board, used as the denominator of the score ring.
  incorrectHeading: The title shown above the incorrect items, only rendered when there are any.
  onRetry: Resets the board so the learner can try again.
  children: The incorrect items, laid out in a single scrolling row.
*/
interface ExerciseResultsPanelProps {
  score: number;
  total: number;
  incorrectHeading: string;
  onRetry(): void;
  children?: ReactNode;
}

export default function ExerciseResultsPanel({
  score,
  total,
  incorrectHeading,
  onRetry,
  children,
}: ExerciseResultsPanelProps) {
  const fractionCorrect = total > 0 ? score / total : 0;
  const incorrectItems = Children.toArray(children);

  return (
    <div className={styles["results-panel--container"]}>
      <div className={styles["results-panel--results-text"]}>
        <div className={styles["results--circle"]}></div>
        <p className={`text-eyebrow ${styles["results-text"]}`}>RESULTS</p>
      </div>
      <div className={styles["results-panel--circle--container"]}>
        <svg
          className={styles["results-panel--circle-ring"]}
          viewBox="0 0 100 100"
          role="img"
          aria-label={`Score: ${score} out of ${total}`}
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
              strokeDashoffset: 100 - fractionCorrect * 100,
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
        <div className={styles["score-description--container"]}>
          <div>
            <span className={styles["score-text"]}>{score}</span>
            <span className={styles["max-score-text"]}>/{total}</span>
          </div>
          {fractionCorrect > 0.75 && (
            <p className={styles["score-description-good"]}>
              {score === total ? "PERFECT" : "NICE"}
            </p>
          )}
        </div>
      </div>
      <div className={styles["results-panel--incorrect-items-title"]}>
        {incorrectItems.length > 0 && incorrectHeading && (
          <h2 className={`text-h2 ${styles["incorrect-items--header"]}`}>
            {incorrectHeading}
          </h2>
        )}
      </div>
      <div className={styles["results-panel--incorrect-items"]}>
        {incorrectItems}
      </div>
      <div className={styles["retry-button--container"]}>
        <button
          className={`btn btn--primary ${styles["retry-button"]}`}
          type="button"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    </div>
  );
}
