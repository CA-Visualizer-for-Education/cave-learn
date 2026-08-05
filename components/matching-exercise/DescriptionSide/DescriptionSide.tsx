'use client'
// components/matching-exercise/DescriptionSide/DescriptionSide.tsx
// The right column of the matching board: one description card per CA component.
import { CA_COMPONENTS } from '@/lib/ca-data'
import type { VerificationStatus } from '../../common/ComponentPieces/ComponentPieces'
import DescriptionComponentPiece from '../DescriptionComponentPiece/DescriptionComponentPiece'
import styles from './DescriptionSide.module.css'

/*
isVerified: whether "Check my work" has been pressed
statuses: for each component id, whether the wire into its description was correct
*/
interface DescriptionSideProps {
  isVerified: boolean;
  statuses: Record<string, VerificationStatus>;
}

export default function DescriptionSide({ isVerified, statuses }: DescriptionSideProps) {
  return (
    <div className={styles['button--column']}>
      {/* TODO(exercise): descriptions render in component order → matches line up trivially. Shuffle CA_COMPONENTS for this column to make it a real puzzle. */}
      {CA_COMPONENTS.map((component) => (
        // data-side/data-id are what MatchingComponentBoard measures and snaps wires to.
        <div key={component.id} data-side="description" data-id={component.id}>
          <DescriptionComponentPiece
            label={component.id}
            verificationStatus={isVerified ? statuses[component.id] ?? 'unverified' : 'unverified'}
          />
        </div>
      ))}
    </div>
  )
}
