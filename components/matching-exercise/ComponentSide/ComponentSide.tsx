'use client'
// components/matching-exercise/ComponentSide/ComponentSide.tsx
// The left column of the matching board: one component chip per CA component.
import { CA_COMPONENTS } from '@/lib/ca-data'
import ComponentPieces from '../../common/ComponentPieces/ComponentPieces'
import styles from './ComponentSide.module.css'

/*
isVerified: whether "Check my work" has been pressed
outlines: for each component id, either "button--correct" or "button--incorrect" once the board is verified, otherwise ""
*/
interface ComponentSideProps {
  isVerified: boolean;
  outlines: Record<string, string>;
}

export default function ComponentSide({ isVerified, outlines }: ComponentSideProps) {
  return (
    <div className={styles['button--column']}>
      {CA_COMPONENTS.map((component) => (
        // data-side/data-id are what MatchingComponentBoard measures and snaps wires to.
        <div key={component.id} data-side="component" data-id={component.id}>
          <ComponentPieces
            layer={component.layer}
            label={component.id}
            inDroppable={true}
            // Pieces here are wired up, never dragged
            draggable={false}
            isVerified={isVerified}
            buttonOutline={isVerified ? outlines[component.id] ?? '' : ''}
          />
        </div>
      ))}
    </div>
  )
}
