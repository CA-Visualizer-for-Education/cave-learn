'use client'
// components/matching-exercise/ComponentSide/ComponentSide.tsx
// The left column of the matching board: one component chip per CA component.
import { CA_COMPONENTS } from '@/lib/ca-data'
import ComponentPieces from '../../common/ComponentPieces/ComponentPieces'
import styles from './ComponentSide.module.css'

interface ComponentSideProps {
  isVerified: boolean;
  outlines: Record<string, string>;
}

export default function ComponentSide({ isVerified, outlines }: ComponentSideProps) {
  return ( <>
    <div className={styles['button--column']}>
      {CA_COMPONENTS.map((component) => (
        // added key here so that Next no longer gives an issue
        <div key={component.id} data-side="component" data-id={component.id}>
          <ComponentPieces
            layer={component.layer}
            label={component.id}
            inDroppable={true}
            draggable={false}
            isVerified={isVerified}
            buttonOutline={isVerified ? outlines[component.id] ?? '' : ''}
          />
        </div>
      ))}
    </div>
    </>
  )
}
