'use client'

import { useState } from 'react'
import { Box } from '@mui/material'
import ExerciseBoardSubheader from './ExerciseBoardSubheader/ExerciseBoardSubheader'
import ExerciseBoardSidebar from './ExerciseBoardSidebar/ExerciseBoardSidebar'
import MatchingComponentBoard, { Wire } from './MatchingComponentBoard/MatchingComponentBoard'
import { CA_COMPONENTS } from '@/lib/ca-data'

// A wire is correct when the component it starts from is the one its description belongs to.
function isCorrect(wire: Wire): boolean {
  return wire.componentId === wire.descriptionId;
}

// Per-id outline class for one side of the board. Pieces with no wire attached stay
// unstyled so "unanswered" never reads as "correct".
function toOutlines(wires: Wire[], side: 'component' | 'description'): Record<string, string> {
  return Object.fromEntries(
    CA_COMPONENTS.map((component) => {
      const wire = wires.find(w => (side === 'component' ? w.componentId : w.descriptionId) === component.id);
      if (!wire) return [component.id, ''];
      return [component.id, isCorrect(wire) ? 'button--correct' : 'button--incorrect'];
    })
  );
}

export default function MatchingExerciseBoard() {
  const [wires, setWires] = useState<Wire[]>([]);
  const [score, setScore] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // Each piece can hold at most one wire, so a new connection replaces whatever
  // was already attached to either of its two ends.
  const addWire = (wire: Wire) => {
    setWires(prev => [
      ...prev.filter(w => w.componentId !== wire.componentId && w.descriptionId !== wire.descriptionId),
      wire
    ]);
  };

  const checkWork = () => {
    setScore(wires.filter(isCorrect).length);
    setIsVerified(true);
  };

  // Reset clears the board entirely; retry keeps the wires so the user can adjust them.
  const resetBoard = () => {
    setWires([]);
    setScore(0);
    setIsVerified(false);
  };

  const retryBoard = () => {
    setIsVerified(false);
  };

  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', flexGrow: 1}}>
      <ExerciseBoardSubheader isVerified={isVerified} handleCheckWork={checkWork} handleReset={resetBoard} />
      <MatchingComponentBoard
        wires={wires}
        onConnect={addWire}
        isVerified={isVerified}
        componentOutlines={toOutlines(wires, 'component')}
        descriptionOutlines={toOutlines(wires, 'description')}
      />
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
      <ExerciseBoardSidebar isVerified={isVerified} score={score} handleReset={resetBoard} handleCheckWork={checkWork}/>
    </Box>
    </>
  )
}
