// components/exercise/ExerciseBoardSubheader/ExerciseBoardSubheader.tsx
// The subheader of the exercise page.
import styles from './ExerciseBoardSubheader.module.css';


export default function ExerciseBoardSubheader(){
    return (
    <div className={styles['subheader--container']}>
        <div className={styles['subheader--text']}>
            <p className="text-eyebrow">Exercise   .   Test Yourself</p>
            <p className="text-h2">Drag every component into its layer.</p>
        </div>
    </div>
)}
