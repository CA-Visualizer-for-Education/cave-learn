import { CA_COMPONENTS } from '@/lib/ca-data';
import ComponentPieces from '../../common/ComponentPieces/ComponentPieces';
import ExerciseResultsPanel from '../../common/ExerciseResultsPanel/ExerciseResultsPanel';

interface ExerciseBoardSidebarProps {
    isVerified: boolean;
    score: number;
    handleReset(): void;
    isCorrect(componentId: string): boolean;
}
export default function ExerciseBoardSidebar ({ isVerified, score, handleReset, isCorrect }: ExerciseBoardSidebarProps) {
    return (isVerified ? <>
        <ExerciseResultsPanel score={score} total={CA_COMPONENTS.length} incorrectHeading="Incorrect Components" onRetry={handleReset}>
            {CA_COMPONENTS.filter((component) => (!isCorrect(component.id))).map((component) => (<ComponentPieces key={component.id} layer={component.layer} label={component.id} inDroppable={false} isVerified={isVerified} draggable={!isVerified} buttonOutline={""}/>))}
        </ExerciseResultsPanel>
    </> 
    : "")
}
