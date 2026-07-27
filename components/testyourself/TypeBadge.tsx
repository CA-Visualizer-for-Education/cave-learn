import styles from './TypeBadge.module.css'

enum ActivityType {
    DRAG_AND_DROP = "DRAG AND DROP",
    MATCHING = "MATCHING",
    QUIZ = "QUIZ",
    MULTIPLE_CHOICE = "MULTIPLE CHOICE"
}

const activityTypeBackground: Record<ActivityType, string> = {
    [ActivityType.DRAG_AND_DROP]: "var(--background-blue)",
    [ActivityType.MATCHING]: "var(--background-pink)",
    [ActivityType.QUIZ]: "var(--background-green)",
    [ActivityType.MULTIPLE_CHOICE]: "var(--background-yellow)"
}

const activityTypeColor: Record<ActivityType, string> = {
    [ActivityType.DRAG_AND_DROP]: "var(--color-brand-blue)",
    [ActivityType.MATCHING]: "var(--color-brand-pink)",
    [ActivityType.QUIZ]: "var(--color-brand-green)",
    [ActivityType.MULTIPLE_CHOICE]: "var(--badge-text-yellow)"
}

export const TypeBadge = ({ type }: { type: string }) => {
    if (!Object.values(ActivityType).includes(type.toUpperCase() as ActivityType)) {
        throw new Error(`TypeBadge: unknown type: "${type}"`);
    }
    const activityType = type.toUpperCase() as ActivityType;

    return (
        <div
            style={{ backgroundColor: activityTypeBackground[activityType] }}
            className={styles.typeBadge}
        >
            <p
                style={{ color: activityTypeColor[activityType]}}
                className="text-eyebrow"
            >
                {type}
            </p>
        </div>
    )
}
