// components/matching-exercise/DescriptionComponentPiece/DescriptionComponentPiece.tsx
// A single description card in the matching exercise, matched to a component chip.
import styles from './DescriptionComponentPiece.module.css';
import { CA_COMPONENTS } from "@/lib/ca-data"

interface DescriptionComponentPieceProps {
    label: string;
    buttonOutline: string;
    isVerified: boolean;
}

const getDescription = (label : string): string => {
    return CA_COMPONENTS.find((component) => component.id === label)?.description ?? "";
}

export default function DescriptionComponentPiece({ label, buttonOutline, isVerified } : DescriptionComponentPieceProps) {
    const description = getDescription(label);
    // The clamped copy is what's laid out; the tooltip copy is aria-hidden so the
    // button's accessible name stays the full description exactly once.
    // first span is the cut-off description, second span appears when hovered
    const content = <>
        <span className={styles['description-text']}>{ description }</span>
        <span className={styles['description-tooltip']} aria-hidden="true">{ description }</span>
    </>;

    return (
        <button type="button" aria-label={description} className={`${styles['description-button']} ${isVerified ? styles['description-button'] : ""}`}>{ content }</button>
    )
}
