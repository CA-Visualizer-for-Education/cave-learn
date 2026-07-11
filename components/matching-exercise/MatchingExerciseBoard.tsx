'use client'

import { useState } from 'react'
import { Box } from '@mui/material'
import ComponentSide from './ComponentSide/ComponentSide'
import DescriptionSide from './DescriptionSide/DescriptionSide'
import WireLayer from './Wire/WireLayer'

export default function MatchingExerciseBoard() {
  const [isVerified] = useState(false);
  const [wires, setWires] = useState<Array<{ startPoint: { x: number; y: number }; endPoint: { x: number; y: number }; colour: string }>>([]);
  const [currentWire, setCurrentWire] = useState<{ startPoint: { x: number; y: number }; endPoint: { x: number; y: number }; colour: string } | null>(null);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
        <ComponentSide isVerified={isVerified} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 2 }}></Box>
      <WireLayer wires={wires} />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 5 }}>
        <DescriptionSide isVerified={isVerified} />
      </Box>
    </>
  )
}
