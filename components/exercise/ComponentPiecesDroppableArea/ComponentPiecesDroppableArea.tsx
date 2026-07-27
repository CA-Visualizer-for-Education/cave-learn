'use client'
// components/exercise/ComponentPiecesDroppableArea/ComponentPiecesDroppableArea.tsx
// The droppable area in the exercise board.
import { useDroppable } from '@dnd-kit/react'
import ComponentPieces from '../ComponentPieces/ComponentPieces';
import styles from "./ComponentPiecesDroppableArea.module.css"

/*
buttonLabel: Represents what component of clean architecture the button in the droppable represents.
layer: Represents what layer of clean architecture the button in the droppable represents.
droppableID: The unique id of the droppable area.
buttonOutline: Is either "button--correct" if the button is in the right droppable area or "button-incorrect" otherwise.
isVerified: Whether or not the current board has been verified (check work has been clicked).
*/
interface ComponentPiecesDroppableAreaProps {
    buttonLabel: string;
    buttonLayer: string;
    droppableID: string;
    buttonOutline: string;
    isVerified: boolean;
}

/* This is used by ExerciseBoard. That file passes in "label" which is the same as the id of the ca component 
   The key is just to distinguish it from other components. 
   When CA Diagram is done, you might have to change ${styles[droppableID + '-droppable']} since it is only here
   to match up with the background image which is to be replaced when the diagram is done.
*/
export default function ComponentPiecesDroppableArea({ buttonLabel, buttonLayer, droppableID, isVerified, buttonOutline } : ComponentPiecesDroppableAreaProps){
    const { ref } = useDroppable({ id : droppableID })
    return (
        <div className={`${styles['droppable']} ${styles[droppableID + '-droppable']}`} ref={ref}>
            {buttonLabel != "" && <ComponentPieces key={buttonLabel} layer={buttonLayer} label={buttonLabel} inDroppable={true} isVerified={isVerified} buttonOutline={buttonOutline}/>}
        </div>
    )
}