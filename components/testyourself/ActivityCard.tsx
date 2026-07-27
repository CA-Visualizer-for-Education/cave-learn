import Link from 'next/link'
import { asset } from '@/lib/asset'
import styles from './ActivityCard.module.css'
import { TypeBadge } from "./TypeBadge";

enum Exercise {
    FILL_IN_THE_DIAGRAM = "FILL IN THE DIAGRAM"
}

const designs = {
    [Exercise.FILL_IN_THE_DIAGRAM]: {
        type: "DRAG AND DROP",
        title: "Fill in the diagram",
        content: "Test your knowledge of the diagram by recreating the diagram and checking your work.",
        link: "/exercise",
        graphic: "/drag_and_drop_icon.svg"
    }
}

export const ActivityCard = ({ exercise }: { exercise: string }) => {
    if (exercise === "") {
        return (<article className={`${styles.activityCard} ${styles.placeholderCard}`} />)
    }
    if (!Object.values(Exercise).includes(exercise.toUpperCase() as Exercise)) {
        throw new Error(`No such exercise: "${exercise}"`);
    }
    const content = designs[exercise.toUpperCase() as Exercise];

    return (
        <Link href={content.link}>
        <article className={`${styles.activityCard} ${styles.filledCard}`}>
            <div className={styles.cardFrame}>
                <TypeBadge type={content.type} />
                <h2 style={{ marginBottom: "var(--space-2)", marginTop: "var(--space-2)" }}
                    className="text-h2"
                >
                    {content.title}
                </h2>
                <p className="text-body">{content.content}</p>
            </div>
            <div style={{ backgroundColor: "#DDECF8"}}
            className={`${styles.cardFrame} ${styles.cardImage}`}>
                <img src={asset(content.graphic)} alt={`${content.type} icon`} />
            </div>
        </article>
        </Link>
    )
}
