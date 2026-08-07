"use client";
// components/exercise/ComponentPiecesDroppableArea/ComponentPiecesDroppableArea.tsx
// The droppable area in the exercise board.
import { useDroppable } from "@dnd-kit/react";
import { ComponentPieces } from "../../common/ComponentPieces/ComponentPieces";
import styles from "./ComponentPiecesDroppableArea.module.css";
import { ReactElement } from "react";

/*
  id: The unique id of the droppable area.
  draggable: The draggable element to be placed in this droppable area.
*/
interface ComponentPiecesDroppableAreaProps {
  id: string;
  draggable?: ReactElement<typeof ComponentPieces>;
}

/* This is used by ExerciseBoard. That file passes in "id" which is the same as the id of the ca component 
   The key is just to distinguish it from other components. 
   When CA Diagram is done, you might have to change ${styles[droppableID + '-droppable']} since it is only here
   to match up with the background image which is to be replaced when the diagram is done.
*/
export default function ComponentPiecesDroppableArea({
  id,
  draggable,
}: ComponentPiecesDroppableAreaProps) {
  const { ref } = useDroppable({ id });
  return (
    <div
      className={`${styles["droppable"]} ${styles[id + "-droppable"]}`}
      ref={ref}
    >
      {draggable}
    </div>
  );
}
