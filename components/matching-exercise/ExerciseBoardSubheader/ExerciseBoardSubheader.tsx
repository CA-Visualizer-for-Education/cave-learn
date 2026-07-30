// components/matching-exercise/ExerciseBoardSubheader/ExerciseBoardSubheader.tsx
// The subheader of the matching exercise page.
import styles from './ExerciseBoardSubheader.module.css';

/*
handleCheckWork: Shows the score and triggers a change in the sidebar.
handleReset: Clears every wire the user has drawn.
*/
interface ExerciseBoardSubheaderProps {
    isVerified: boolean;
    handleCheckWork?(): void;
    handleReset?(): void;
}

export default function ExerciseBoardSubheader({ isVerified, handleCheckWork, handleReset } : ExerciseBoardSubheaderProps){
    return (isVerified ?
    <div className={styles['subheader--container']}>
        <div className={styles['subheader--text']}>
            <p className="text-eyebrow">Exercise   .   Test Yourself</p>
            <p className="text-h2">Match the component piece to the description</p>
        </div>
        <div className={styles['subheader--instructions']}>
            <p className="text-eyebrow">Wires connect each component with the description you think it belongs to.</p>
            <div className={styles['check-work-reset--container']}>
                <button className={`btn btn--primary btn--sm ${styles['btn--check-work']}`} type="button" onClick={handleCheckWork}>Check my work</button>
                <button className={`btn btn--secondary btn--sm ${styles['btn--reset']}`} type="button" onClick={handleReset}>Reset</button>
            </div>
        </div>
    </div>
    : ""
)}
