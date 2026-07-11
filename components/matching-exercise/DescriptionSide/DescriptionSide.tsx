'use client'
// components/matching-exercise/DescriptionSide/DescriptionSide.tsx
// The right column of the matching board: one description card per CA component.
import { CA_COMPONENTS } from '@/lib/ca-data'
import DescriptionComponentPiece from '../DescriptionComponentPiece/DescriptionComponentPiece'
import styles from './DescriptionSide.module.css'

interface DescriptionSideProps {
  isVerified: boolean;
}

export default function DescriptionSide({ isVerified }: DescriptionSideProps) {
  return ( <>
    <div className={styles['button--column']}>
      {CA_COMPONENTS.map((component) => ( <>
          <DescriptionComponentPiece
            label={component.id}
            buttonOutline="outline"
            isVerified={isVerified}
          />
          <div data-side="description" data-id={component.id} className={`${styles['piece--row']}`}></div>
      </> ))}
    </div>
    </>
  )
}
