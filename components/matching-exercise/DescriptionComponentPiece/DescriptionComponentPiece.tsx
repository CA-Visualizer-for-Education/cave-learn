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
    return (isVerified ?
        <button type="button" className={`${styles['description-button']} ${styles[buttonOutline]}`}>{ getDescription(label) }</button>
        :
        <button type="button" className={styles['description-button']}>{ getDescription(label) }</button>
    )
}
