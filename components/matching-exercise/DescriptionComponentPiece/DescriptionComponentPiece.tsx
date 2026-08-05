// components/matching-exercise/DescriptionComponentPiece/DescriptionComponentPiece.tsx
// A single description card in the matching exercise, matched to a component chip.
import styles from './DescriptionComponentPiece.module.css';
import type { VerificationStatus } from '../../common/ComponentPieces/ComponentPieces';
import { CA_COMPONENTS } from "@/lib/ca-data"

/*
label: The id of the component this card describes.
verificationStatus: Whether the wire into this description was correct, once the board is verified.
*/
interface DescriptionComponentPieceProps {
    label: string;
    verificationStatus: VerificationStatus;
}

/** Look up the prose description for a component id. */
const getDescription = (label : string): string => {
    return CA_COMPONENTS.find((component) => component.id === label)?.description ?? "";
}

/** The outline class for a card, mirroring the one ComponentPieces uses on the other side. */
const statusToOutline: Record<VerificationStatus, string> = {
    'unverified': '',
    'verified-correct': 'button--correct',
    'verified-incorrect': 'button--incorrect',
};

export default function DescriptionComponentPiece({ label, verificationStatus } : DescriptionComponentPieceProps) {
    const description = getDescription(label);
    // The clamped copy is what's laid out; the tooltip copy is aria-hidden so the
    // button's accessible name stays the full description exactly once.
    // first span is the cut-off description, second span appears when hovered
    const content = <>
        <span className={styles['description-text']}>{ description }</span>
        <span className={styles['description-tooltip']} aria-hidden="true">{ description }</span>
    </>;

    const outline = styles[statusToOutline[verificationStatus]] ?? "";

    return (
        <button type="button" aria-label={description} className={`${styles['description-button']} ${outline}`}>{ content }</button>
    )
}
