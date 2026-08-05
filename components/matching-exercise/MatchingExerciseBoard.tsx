'use client'
// components/matching-exercise/MatchingExerciseBoard.tsx
// The main body of the matching exercise page. Owns the wires the learner has
// drawn and the verified/score state; the board below it is presentational.
import { useState } from 'react'
import { Box } from '@mui/material'
import ExerciseBoardSubheader from './ExerciseBoardSubheader/ExerciseBoardSubheader'
import ExerciseBoardSidebar from './ExerciseBoardSidebar/ExerciseBoardSidebar'
import MatchingComponentBoard from './MatchingComponentBoard/MatchingComponentBoard'
import type { Wire } from './types'
import { CA_COMPONENTS } from '@/lib/ca-data'
import styles from './MatchingExerciseBoard.module.css';

/** A wire is correct when the component it starts from is the one its description belongs to. */
function isCorrectFromWire(wire: Wire): boolean {
  return wire.componentId === wire.descriptionId;
}

/*
Per-id outline class for one side of the board. Pieces with no wire attached stay
unstyled so "unanswered" never reads as "correct".
*/
function toOutlines(wires: Wire[], side: 'component' | 'description'): Record<string, string> {
  return Object.fromEntries(
    CA_COMPONENTS.map((component) => {
      const wire = wires.find(w => (side === 'component' ? w.componentId : w.descriptionId) === component.id);
      if (!wire) return [component.id, ''];
      return [component.id, isCorrectFromWire(wire) ? 'button--correct' : 'button--incorrect'];
    })
  );
}

export default function MatchingExerciseBoard() {
  const [wires, setWires] = useState<Wire[]>([]);
  const [score, setScore] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  /** Whether the component's wire (if it has one) lands on its own description. */
  function isCorrectFromComponentId(componentId: string): boolean {
    const wire = wires.find(w => w.componentId === componentId);
    return wire ? isCorrectFromWire(wire) : false;
  }

  /*
  Records a new connection. Each piece can hold at most one wire, so a new
  connection replaces whatever was already attached to either of its two ends.
  */
  const addWire = (wire: Wire) => {
    setWires(prev => [
      ...prev.filter(w => w.componentId !== wire.componentId && w.descriptionId !== wire.descriptionId),
      wire
    ]);
  };

  /** Scores the board and switches the sidebar to results, once every piece is wired. */
  const checkWork = () => {
    // unsure if we want this but you can only check if all your wires are connected
    if (wires.length != CA_COMPONENTS.length) return;
    setScore(wires.filter(isCorrectFromWire).length);
    setIsVerified(true);
  };

  /** Clears the board entirely and returns it to the unverified state. */
  const resetBoard = () => {
    setWires([]);
    setScore(0);
    setIsVerified(false);
  };

  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', flexGrow: 1}}>
      <ExerciseBoardSubheader isVerified={isVerified} handleCheckWork={checkWork} handleReset={resetBoard} />
      <div className = {styles['board']}>
        <MatchingComponentBoard
          wires={wires}
          onConnect={addWire}
          isVerified={isVerified}
          componentOutlines={toOutlines(wires, 'component')}
          descriptionOutlines={toOutlines(wires, 'description')}
        />
      </div>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
      <ExerciseBoardSidebar isVerified={isVerified} score={score} handleReset={resetBoard} isCorrect={isCorrectFromComponentId}/>
    </Box>
    </>
  )
}
