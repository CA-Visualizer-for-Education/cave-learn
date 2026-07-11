'use client'
// components/matching-exercise/ComponentSide/ComponentSide.tsx
// The left column of the matching board: one component chip per CA component.
import { CA_COMPONENTS, CA_LAYERS } from '@/lib/ca-data'
import ComponentPieces from '../../common/ComponentPieces/ComponentPieces'
import styles from './ComponentSide.module.css'

interface ComponentSideProps {
  isVerified: boolean;
}

export default function ComponentSide({ isVerified }: ComponentSideProps) {
  return ( <>
    <div className={styles['button--column']}>
      {CA_COMPONENTS.map((component) => ( <>
        <ComponentPieces
          layer={component.layer}
          label={component.id}
          inDroppable={true}
          draggable={false}
          isVerified={isVerified}
          buttonOutline=""
        />
        <div data-side="description" data-id={component.id} className={`${styles['piece--row']}`}></div>
      </> ))}
    </div>
    </>
  )
}
