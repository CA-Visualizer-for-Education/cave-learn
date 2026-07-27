'use client';
// components/exercise/ExerciseBoardSidebar/ExerciseBoardSidebar.tsx
// The sidebar of the exercise page.
import ComponentPieces from "../ComponentPieces/ComponentPieces"
import { CA_COMPONENTS } from "@/lib/ca-data"
import styles from "./ExerciseBoardSidebar.module.css"
import { useDroppable } from '@dnd-kit/react'

/*
isPlaced: A mapping of draggable button ids to the id of the droppable area they are located in.
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

export default function ExerciseBoardSidebar({ isPlaced, isVerified, score, handleReset, handleRetry, handleCheckWork } : ExerciseBoardSidebarProps){
    // const {ref} = useDroppable({id : "sidebar-droppable"}) was removed to see if it still works directly passing ref.

    return (isVerified ? 
    <div className={styles['sidebar--verified--container']}>
        <div className={styles['sidebar--results-text']}>
            <div className={styles['results--circle']}></div>
            <p className={`text-eyebrow ${styles['results-text']}`}>RESULTS</p>
        </div>
        <div className={styles['sidebar--circle--container']}>
            <svg className={styles['sidebar--circle-ring']} width="12vw" height="12vw">
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
                style={{strokeDasharray: 'calc(2 * 3.14 * 4.5vw)', strokeDashoffset: `calc(2 * 3.14 * 4.5vw - (2 * 3.14 * 4.5vw) * ${score/CA_COMPONENTS.length})`}}
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
                <span className={styles['score-text']}>{score}</span><span className={styles['max-score-text']}>/{CA_COMPONENTS.length}</span>
                {score/CA_COMPONENTS.length > 0.75 ? (score == CA_COMPONENTS.length ? <p className={styles['score-description-good']}>PERFECT</p> : <p className={styles['score-description-good']}>NICE</p>) : <p className={styles['score-description-good']}>&nbsp;</p>}
            </div>
        </div>
        <div className={styles['sidebar--incorrect-components-title']}>
            {CA_COMPONENTS.some((component) => (isPlaced[component.id] != component.id)) && <p className={`text-h2 ${styles['incorrect-components--header']}`}>Incorrect Components</p>}
        </div>
        <div className={styles['sidebar--incorrect-components']}>
            <div className={styles['button--column']}>
                {CA_COMPONENTS.filter((component) => (isPlaced[component.id] != component.id)).map((component, index) => (index % 2 == 0 && <ComponentPieces key={component.id} layer={component.layer} label={component.id} inDroppable={false} isVerified={isVerified} buttonOutline={""}/>))}
            </div>
            <div className={styles['button--column']}>
                {CA_COMPONENTS.filter((component) => (isPlaced[component.id] != component.id)).map((component, index) => (index % 2 == 1 && <ComponentPieces key={component.id} layer={component.layer} label={component.id} inDroppable={false} isVerified={isVerified} buttonOutline={""}/>))}
            </div>
        </div>
        <div className={styles['retry-button--container']}>
            <button className={`btn btn--primary ${styles['retry-button']}`} type="button" onClick={handleRetry}>Retry</button>
        </div>
    </div>
    :
    (<aside className={styles['sidebar--container']}>
        <div className={styles['pieces--container']}>
            <p>PIECES</p>
        </div>
        <div className={styles['description--container']}>
            <p className={styles['description-text']}>Drag each chip into the slot you think it belongs in. Drop chips back here to remove.</p>
        </div>
        <div className={styles['buttons--container']} ref={useDroppable({id : "sidebar-droppable"}).ref}>
            <div className={styles['button--column']}>
                {CA_COMPONENTS.filter((component) => (isPlaced[component.id] == "")).map((component, index) => (index % 2 == 0 && <ComponentPieces key={component.id} layer={component.layer} label={component.id} inDroppable={false} isVerified={isVerified} buttonOutline={""}/>))}
            </div>
            <div className={styles['button--column']}>
                {CA_COMPONENTS.filter((component) => (isPlaced[component.id] == "")).map((component, index) => (index % 2 == 1 && <ComponentPieces key={component.id} layer={component.layer} label={component.id} inDroppable={false} isVerified={isVerified} buttonOutline={""}/>))}
            </div>
        </div>
        <div className={styles['check-work-reset--container']}>
            <button className={`btn btn--primary btn--check-work ${styles['btn--check-work']}`} onClick={handleCheckWork} disabled={CA_COMPONENTS.some((component) => (isPlaced[component.id] == ""))}>Check My Work</button>
            <button className={`btn btn--secondary ${styles['btn--reset']}`} onClick={handleReset}>Reset</button>
        </div>
    </aside>
)
)}
