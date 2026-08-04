// components/common/ExerciseResultsPanel/ExerciseResultsPanel.tsx
// The results view shown in an exercise sidebar after the board has been verified.
import { Children, type ReactNode } from "react"
import styles from "./ExerciseResultsPanel.module.css"

/*
score: The amount of answers the learner got right.
total: The amount of answers on the board, used as the denominator of the score ring.
incorrectHeading: The title shown above the incorrect items, only rendered when there are any.
onRetry: Resets the board so the learner can try again.
children: The incorrect items. They are laid out into two columns in the order given, so pass a flat list.
*/
interface ExerciseResultsPanelProps {
    score: number;
    total: number;
    incorrectHeading: string;
    onRetry(): void;
    children?: ReactNode;
}

export default function ExerciseResultsPanel({ score, total, incorrectHeading, onRetry, children } : ExerciseResultsPanelProps){
    const fractionCorrect = total > 0 ? score / total : 0;
    const incorrectItems = Children.toArray(children);

    return (
    <div className={styles['results-panel--container']}>
        <div className={styles['results-panel--results-text']}>
            <div className={styles['results--circle']}></div>
            <p className={`text-eyebrow ${styles['results-text']}`}>RESULTS</p>
        </div>
        <div className={styles['results-panel--circle--container']}>
            <svg className={styles['results-panel--circle-ring']} width="12vw" height="12vw">
                <circle
                stroke="#e6e6e6"
                strokeWidth="15"
                fill="transparent"
                r="4.5vw"
                cx="50%"
                cy="50%"
                />
                {/* To calculate strokeDasharray: 2 * PI * 4.5vw(radius). To calculate strokeDashoffset: take strokeDasharray - strokeDasharray * (% of circle)*/}
                <circle
                style={{strokeDasharray: 'calc(2 * 3.14 * 4.5vw)', strokeDashoffset: `calc(2 * 3.14 * 4.5vw - (2 * 3.14 * 4.5vw) * ${fractionCorrect})`}}
                stroke="var(--color-brand-green)"
                strokeWidth="15"
                strokeLinecap="round"
                fill="transparent"
                r="4.5vw"
                cx="50%"
                cy="50%"
                />
            </svg>
            <div className={styles["score-description--container"]}>
                <span className={styles['score-text']}>{score}</span><span className={styles['max-score-text']}>/{total}</span>
                {fractionCorrect > 0.75 ? (score == total ? <p className={styles['score-description-good']}>PERFECT</p> : <p className={styles['score-description-good']}>NICE</p>) : <p className={styles['score-description-good']}>&nbsp;</p>}
            </div>
        </div>
        <div className={styles['results-panel--incorrect-items-title']}>
            {incorrectItems.length > 0 && incorrectHeading && <p className={`text-h2 ${styles['incorrect-items--header']}`}>{incorrectHeading}</p>}
        </div>
        <div className={styles['results-panel--incorrect-items']}>
            <div className={styles['button--column']}>
                {incorrectItems.filter((item, index) => (index % 2 == 0))}
            </div>
            <div className={styles['button--column']}>
                {incorrectItems.filter((item, index) => (index % 2 == 1))}
            </div>
        </div>
        <div className={styles['retry-button--container']}>
            <button className={`btn btn--primary ${styles['retry-button']}`} type="button" onClick={onRetry}>Retry</button>
        </div>
    </div>
    )
}
