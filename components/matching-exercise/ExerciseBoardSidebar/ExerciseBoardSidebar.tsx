// components/matching-exercise/ExerciseBoardSidebar/ExerciseBoardSidebar.tsx
// The sidebar of the matching exercise page. Nothing is shown until the board is
// verified; after that it is the shared results panel listing the missed components.
import { CA_COMPONENTS } from '@/lib/ca-data';
import { ComponentPieces } from '../../common/ComponentPieces/ComponentPieces';
import ExerciseResultsPanel from '../../common/ExerciseResultsPanel/ExerciseResultsPanel';

/*
isVerified: whether "Check my work" has been pressed.
score: the number of wires connecting a component to its own description.
handleReset: clears every wire and returns the board to the unverified state.
isCorrect: whether the given component is wired to its own description.
*/
interface ExerciseBoardSidebarProps {
    isVerified: boolean;
    score: number;
    handleReset(): void;
    isCorrect(componentId: string): boolean;
}

export default function ExerciseBoardSidebar ({ isVerified, score, handleReset, isCorrect }: ExerciseBoardSidebarProps) {
    if (!isVerified) return null;

    return (
        <ExerciseResultsPanel score={score} total={CA_COMPONENTS.length} incorrectHeading="Incorrect Components" onRetry={handleReset}>
            {CA_COMPONENTS.filter((component) => !isCorrect(component.id)).map((component) => (
                <ComponentPieces
                    key={component.id}
                    label={component.id}
                    layer={component.layer}
                    currentLayer={''}
                    verificationStatus={'verified-incorrect'}
                    draggable={false}
                />
            ))}
        </ExerciseResultsPanel>
    )
}
