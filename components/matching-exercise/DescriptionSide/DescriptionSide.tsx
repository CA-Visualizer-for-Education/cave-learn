'use client'
// components/matching-exercise/DescriptionSide/DescriptionSide.tsx
// The right column of the matching board: one description card per CA component.
import { CA_COMPONENTS } from '@/lib/ca-data'
import DescriptionComponentPiece from '../DescriptionComponentPiece/DescriptionComponentPiece'
import styles from './DescriptionSide.module.css'

/*
isVerified: whether "Check my work" has been pressed; outlines stay hidden until it has.
outlines: per-component-id correctness class, keyed by the component the description belongs to.
*/
interface DescriptionSideProps {
  isVerified: boolean;
  outlines: Record<string, string>;
}

export default function DescriptionSide({ isVerified, outlines }: DescriptionSideProps) {
  return (
    <div className={styles['button--column']}>
      {CA_COMPONENTS.map((component) => (
        // data-side/data-id are what MatchingComponentBoard measures and snaps wires to.
        <div key={component.id} data-side="description" data-id={component.id}>
          <DescriptionComponentPiece
            label={component.id}
            buttonOutline={isVerified ? outlines[component.id] ?? '' : ''}
          />
        </div>
      ))}
    </div>
  )
}
