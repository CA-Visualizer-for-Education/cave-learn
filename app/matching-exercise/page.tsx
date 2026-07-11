'use client'

import { Box } from "@mui/material";
import MatchingExerciseBoard from '@/components/matching-exercise/MatchingExerciseBoard';

export default function MatchingExercisePage() {
  return <main className="page-shell">
    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 64px)'}}>
      <MatchingExerciseBoard />
    </Box>
  </main>
}
