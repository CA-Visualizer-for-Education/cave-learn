"use client";
// components/exercise/ComponentBoard/ComponentBoard.tsx
// The drag-and-drop diagram canvas. Same layer layout as CADiagram but with empty drop zones.
/* 
---A lot of this is a placeholder until the CA Diagram is done.---
In place of the CA Diagram, there is a <div> with the CA Diagram saved as an image background
and all of the droppables are made to match up with it. When the diagram is done, change this.
*/
import styles from "./ComponentBoard.module.css";
import { CA_COMPONENTS } from "@/lib/ca-data";
import ComponentPiecesDroppableArea from "../ComponentPiecesDroppableArea/ComponentPiecesDroppableArea";
import { ReactElement } from "react";
import {
  ComponentPieces,
  type VerificationStatus,
} from "../ComponentPieces/ComponentPieces";

const componentToLayer = Object.fromEntries(
  CA_COMPONENTS.map((component) => [component.id, component.layer]),
);

/* 
  isPlaced maps button ids -> droppable area ids
    - shows the area each button is in
  isFilled maps droppable area ids -> button ids
    - shows which button each area contains
  isVerified: Whether or not the current board has been verified (check work has been clicked).
*/
interface ComponentBoardProps {
  isPlaced: Record<string, string>;
  isFilled: Record<string, string>;
  isVerified: boolean;
}

export default function ComponentBoard({
  isPlaced,
  isFilled,
  isVerified,
}: ComponentBoardProps) {
  function createDroppable(
    caComponentDroppable: string,
  ): ReactElement<typeof ComponentPiecesDroppableArea> {
    if (isFilled[caComponentDroppable] === "") {
      // don't render a component piece if this droppable is empty
      return <ComponentPiecesDroppableArea id={caComponentDroppable} />;
    }

    const componentPieceLabel = isFilled[caComponentDroppable];

    const verificationStatus: VerificationStatus = (() => {
      if (isVerified) {
        if (caComponentDroppable === componentPieceLabel) {
          return "verified-correct";
        } else {
          return "verified-incorrect";
        }
      } else {
        return "unverified";
      }
    })();

    const componentPiece = (
      <ComponentPieces
        // `key` prop is required so React can correctly swap component piece instances in the diagram
        key={componentPieceLabel}
        label={componentPieceLabel}
        layer={componentToLayer[componentPieceLabel]}
        currentLayer={componentToLayer[isPlaced[componentPieceLabel]]}
        verificationStatus={verificationStatus}
      />
    );

    return (
      <ComponentPiecesDroppableArea
        id={caComponentDroppable}
        draggable={componentPiece}
      />
    );
  }

  return (
    <div className={styles["cadiagram"]}>
      {/* {CA_COMPONENTS.map((component) => (<ComponentPiecesDroppableArea key={component.id} buttonLayer={isFilled[component.id] != "" ? componentToLayer[isFilled[component.id]] : ""} buttonLabel={isFilled[component.id]} droppableID={component.id} isVerified={isVerified} buttonOutline={component.id == isFilled[component.id] ? "button--correct" : "button--incorrect"}/>))} */}
      <div className={styles["cadiagram-sub-container"]}>
        <div className={styles["diagram-container"]}>
          <div className={styles["top-half"]}>
            <div className={styles["interface-adapters-container"]}>
              {createDroppable("controller")}
              {createDroppable("presenter")}
              {createDroppable("view-model")}
            </div>
            <div className={styles["application-business-rules-container"]}>
              {createDroppable("input-data")}
              {createDroppable("input-boundary")}
              {createDroppable("output-boundary")}
              {createDroppable("output-data")}
            </div>
            <div className={styles["use-case-interactor-container"]}>
              {createDroppable("use-case-interactor")}
            </div>
            <div className={styles["entities-dai-container"]}>
              {createDroppable("entities")}
              {createDroppable("data-access-interface")}
            </div>
          </div>
          <div className={styles["frameworks-drivers-container"]}>
            {createDroppable("view")}
            {createDroppable("data-access")}
            {createDroppable("database")}
          </div>
        </div>
        <div className={styles["legend-container"]}></div>
      </div>
    </div>
  );
}
