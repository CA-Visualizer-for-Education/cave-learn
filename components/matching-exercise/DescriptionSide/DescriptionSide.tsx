'use client'
// components/matching-exercise/DescriptionSide/DescriptionSide.tsx
// The right column of the matching board: one description card per CA component.
import { CA_COMPONENTS } from '@/lib/ca-data'
import DescriptionComponentPiece from '../DescriptionComponentPiece/DescriptionComponentPiece'
import styles from './DescriptionSide.module.css'

interface DescriptionSideProps {
  isVerified: boolean;
  outlines: Record<string, string>;
}

export default function DescriptionSide({ isVerified, outlines }: DescriptionSideProps) {
  return ( <>
    <div className={styles['button--column']}>
      {/* TODO(exercise): descriptions render in component order → matches line up trivially. Shuffle CA_COMPONENTS for this column to make it a real puzzle. */}
      {CA_COMPONENTS.map((component) => (
        <div key={component.id} data-side="description" data-id={component.id}>
          <DescriptionComponentPiece
            label={component.id}
            buttonOutline={isVerified ? outlines[component.id] ?? '' : ''}
            isVerified={isVerified}
          />
        </div>
      ))}
    </div>
    </>
  )
}
