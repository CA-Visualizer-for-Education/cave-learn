'use client'
// components/matching-exercise/ComponentSide/ComponentSide.tsx
// The left column of the matching board: one component chip per CA component.
import { CA_COMPONENTS } from '@/lib/ca-data'
import {
  ComponentPieces,
  type VerificationStatus,
} from '../../common/ComponentPieces/ComponentPieces'
import styles from './ComponentSide.module.css'

/*
isVerified: whether "Check my work" has been pressed
statuses: for each component id, whether its wire was correct once the board is verified
*/
interface ComponentSideProps {
  isVerified: boolean;
  statuses: Record<string, VerificationStatus>;
}

export default function ComponentSide({ isVerified, statuses }: ComponentSideProps) {
  return (
    <div className={styles['button--column']}>
      {CA_COMPONENTS.map((component) => (
        // data-side/data-id are what MatchingComponentBoard measures and snaps wires to.
        <div key={component.id} data-side="component" data-id={component.id}>
          <ComponentPieces
            label={component.id}
            layer={component.layer}
            // Chips here are never placed by the learner, so they always show their
            // own layer colour rather than the neutral sidebar colour.
            currentLayer={component.layer}
            verificationStatus={isVerified ? statuses[component.id] ?? 'unverified' : 'unverified'}
            // Pieces here are wired up, never dragged
            draggable={false}
          />
        </div>
      ))}
    </div>
  )
}
