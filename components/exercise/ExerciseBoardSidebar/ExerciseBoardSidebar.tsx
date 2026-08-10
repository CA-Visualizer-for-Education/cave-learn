// components/exercise/ExerciseBoardSidebar/ExerciseBoardSidebar.tsx
// The sidebar of the exercise page.

"use client";
import { useDroppable } from "@dnd-kit/react";
import { CA_COMPONENTS } from "@/lib/ca-data";
import { ComponentPieces } from "../../common/ComponentPieces/ComponentPieces";
import ExerciseResultsPanel from "../../common/ExerciseResultsPanel/ExerciseResultsPanel";
import styles from "./ExerciseBoardSidebar.module.css";

/*
  isPlaced maps button ids -> droppable area ids
    - shows the area each button is in
  isVerified: Whether or not the current board has been verified (check work has been clicked).
  score: The amount of draggable buttons in the correct droppable areas.
  handleReset: Resets the position of all of the draggable pieces after the board has been verified.
  handleRetry: Reset the position of all of the draggable pieces.
  handleCheckWork: Shows the score and triggers a change in the sidebar.
*/
interface ExerciseBoardSidebarProps {
  isPlaced: Record<string, string>;
  isVerified: boolean;
  score: number;
  handleReset(): void;
  handleRetry(): void;
  handleCheckWork(): void;
}

export default function ExerciseBoardSidebar({
  isPlaced,
  isVerified,
  score,
  handleReset,
  handleRetry,
  handleCheckWork,
}: ExerciseBoardSidebarProps) {
  const { ref: sidebarDroppableRef } = useDroppable({
    id: "sidebar-droppable",
  });

  return (
    <>
      {isVerified ? (
        <ExerciseResultsPanel
          score={score}
          total={CA_COMPONENTS.length}
          incorrectHeading="Incorrect Components"
          onRetry={handleRetry}
        >
          {CA_COMPONENTS.filter(
            (component) => isPlaced[component.id] !== component.id,
          ).map((component) => (
            <ComponentPieces
              key={component.id}
              label={component.id}
              layer={component.layer}
              currentLayer={""}
              verificationStatus={"verified-incorrect"}
            />
          ))}
        </ExerciseResultsPanel>
      ) : (
        <aside className={styles["sidebar--container"]}>
          <div className={styles["header--container"]}>
            <div className={styles["title--container"]}>
              <p>PIECES</p>
            </div>
            <div className={styles["description--container"]}>
              <p className={styles["description-text"]}>
                Drag each chip into the slot you think it belongs in. Drop chips
                back here to remove.
              </p>
            </div>
          </div>
          <div
            className={styles["buttons--container"]}
            ref={sidebarDroppableRef}
          >
            {CA_COMPONENTS.filter(
              (component) => isPlaced[component.id] === "",
            ).map((component) => (
              <ComponentPieces
                key={component.id}
                label={component.id}
                layer={component.layer}
                currentLayer={isPlaced[component.id]}
                verificationStatus={"unverified"}
              />
            ))}
          </div>
          <div className={styles["check-work-reset--container"]}>
            <button
              className={`btn btn--primary ${styles["btn--check-work"]} ${CA_COMPONENTS.some((component) => isPlaced[component.id] === "") && styles["btn--check-work--incomplete-diagram"]}`}
              onClick={handleCheckWork}
              type="button"
            >
              Check My Work
            </button>
            <button
              className={`btn btn--secondary ${styles["btn--reset"]}`}
              onClick={handleReset}
              type="button"
            >
              Reset
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
