// components/matching-exercise/DescriptionComponentPiece/DescriptionComponentPiece.tsx
// A single description card in the matching exercise, matched to a component chip.
import styles from './DescriptionComponentPiece.module.css';
import { CA_COMPONENTS } from "@/lib/ca-data"

/*
label: The id of the component this card describes.
buttonOutline: "button--correct" or "button--incorrect" once the board is verified, otherwise "".
*/
interface DescriptionComponentPieceProps {
    label: string;
    buttonOutline: string;
}

/** Look up the prose description for a component id. */
const getDescription = (label : string): string => {
    return CA_COMPONENTS.find((component) => component.id === label)?.description ?? "";
}

export default function DescriptionComponentPiece({ label, buttonOutline } : DescriptionComponentPieceProps) {
    const description = getDescription(label);
    // The clamped copy is what's laid out; the tooltip copy is aria-hidden so the
    // button's accessible name stays the full description exactly once.
    // first span is the cut-off description, second span appears when hovered
    const content = <>
        <span className={styles['description-text']}>{ description }</span>
        <span className={styles['description-tooltip']} aria-hidden="true">{ description }</span>
    </>;

    return (
        <button type="button" aria-label={description} className={`${styles['description-button']} ${styles[buttonOutline] ?? ""}`}>{ content }</button>
    )
}
