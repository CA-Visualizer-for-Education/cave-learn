'use client'
// components/exercise/ComponentBoard/ComponentBoard.tsx
// The drag-and-drop diagram canvas. Same layer layout as CADiagram but with empty drop zones.
/* 
---A lot of this is a placeholder until the CA Diagram is done.---
In place of the CA Diagram, there is a <div> with the CA Diagram saved as an image background
and all of the droppables are made to match up with it. When the diagram is done, change this.
*/
import styles from './ComponentBoard.module.css';
import { CA_COMPONENTS } from '@/lib/ca-data';
import ComponentPiecesDroppableArea from "../ComponentPiecesDroppableArea/ComponentPiecesDroppableArea"

const componentToLayer = Object.fromEntries(CA_COMPONENTS.map((component) => ([component.id, component.layer])));

/* 
isFilled: A mapping of droppable area ids to draggable button ids.
isVerified: Whether or not the current board has been verified (check work has been clicked).
*/
interface ComponentBoardProps {
  isFilled: Record<string, string>;
  isVerified: boolean;
}

export default function ComponentBoard( { isFilled, isVerified } : ComponentBoardProps) {
  return (
  <div className={styles['cadiagram']}>
    {/* {CA_COMPONENTS.map((component) => (<ComponentPiecesDroppableArea key={component.id} buttonLayer={isFilled[component.id] != "" ? componentToLayer[isFilled[component.id]] : ""} buttonLabel={isFilled[component.id]} droppableID={component.id} isVerified={isVerified} buttonOutline={component.id == isFilled[component.id] ? "button--correct" : "button--incorrect"}/>))} */}
    <div className={styles['cadiagram-sub-container']}>
      <div className={styles['diagram-container']}>
        <div className={styles['top-half']}>
          <div className={styles['interface-adapters-container']}>
            <ComponentPiecesDroppableArea key="controller" buttonLayer={isFilled["controller"] != "" ? componentToLayer[isFilled["controller"]] : ""} buttonLabel={isFilled["controller"]} droppableID={"controller"} isVerified={isVerified} buttonOutline={"controller" == isFilled["controller"] ? "button--correct" : "button--incorrect"}/>
            <ComponentPiecesDroppableArea key="presenter" buttonLayer={isFilled["presenter"] != "" ? componentToLayer[isFilled["presenter"]] : ""} buttonLabel={isFilled["presenter"]} droppableID={"presenter"} isVerified={isVerified} buttonOutline={"presenter" == isFilled["presenter"] ? "button--correct" : "button--incorrect"}/>
            <ComponentPiecesDroppableArea key="view-model" buttonLayer={isFilled["view-model"] != "" ? componentToLayer[isFilled["view-model"]] : ""} buttonLabel={isFilled["view-model"]} droppableID={"view-model"} isVerified={isVerified} buttonOutline={"view-model" == isFilled["view-model"] ? "button--correct" : "button--incorrect"}/>
          </div>
          <div className={styles['application-business-rules-container']}>
            <ComponentPiecesDroppableArea key="input-data" buttonLayer={isFilled["input-data"] != "" ? componentToLayer[isFilled["input-data"]] : ""} buttonLabel={isFilled["input-data"]} droppableID={"input-data"} isVerified={isVerified} buttonOutline={"input-data" == isFilled["input-data"] ? "button--correct" : "button--incorrect"}/>
            <ComponentPiecesDroppableArea key="input-boundary" buttonLayer={isFilled["input-boundary"] != "" ? componentToLayer[isFilled["input-boundary"]] : ""} buttonLabel={isFilled["input-boundary"]} droppableID={"input-boundary"} isVerified={isVerified} buttonOutline={"input-boundary" == isFilled["input-boundary"] ? "button--correct" : "button--incorrect"}/>
            <ComponentPiecesDroppableArea key="output-boundary" buttonLayer={isFilled["output-boundary"] != "" ? componentToLayer[isFilled["output-boundary"]] : ""} buttonLabel={isFilled["output-boundary"]} droppableID={"output-boundary"} isVerified={isVerified} buttonOutline={"output-boundary" == isFilled["output-boundary"] ? "button--correct" : "button--incorrect"}/>
            <ComponentPiecesDroppableArea key="output-data" buttonLayer={isFilled["output-data"] != "" ? componentToLayer[isFilled["output-data"]] : ""} buttonLabel={isFilled["output-data"]} droppableID={"output-data"} isVerified={isVerified} buttonOutline={"output-data" == isFilled["output-data"] ? "button--correct" : "button--incorrect"}/>
          </div>
          <div className={styles['use-case-interactor-container']}>
            <ComponentPiecesDroppableArea key="use-case-interactor" buttonLayer={isFilled["use-case-interactor"] != "" ? componentToLayer[isFilled["use-case-interactor"]] : ""} buttonLabel={isFilled["use-case-interactor"]} droppableID={"use-case-interactor"} isVerified={isVerified} buttonOutline={"use-case-interactor" == isFilled["use-case-interactor"] ? "button--correct" : "button--incorrect"}/>
          </div>
          <div className={styles['entities-dai-container']}>
            <ComponentPiecesDroppableArea key="entities" buttonLayer={isFilled["entities"] != "" ? componentToLayer[isFilled["entities"]] : ""} buttonLabel={isFilled["entities"]} droppableID={"entities"} isVerified={isVerified} buttonOutline={"entities" == isFilled["entities"] ? "button--correct" : "button--incorrect"}/>
            <ComponentPiecesDroppableArea key="data-access-interface" buttonLayer={isFilled["data-access-interface"] != "" ? componentToLayer[isFilled["data-access-interface"]] : ""} buttonLabel={isFilled["data-access-interface"]} droppableID={"data-access-interface"} isVerified={isVerified} buttonOutline={"data-access-interface" == isFilled["data-access-interface"] ? "button--correct" : "button--incorrect"}/>
          </div>
        </div>
        <div className={styles['frameworks-drivers-container']}>
          <ComponentPiecesDroppableArea key="view" buttonLayer={isFilled["view"] != "" ? componentToLayer[isFilled["view"]] : ""} buttonLabel={isFilled["view"]} droppableID={"view"} isVerified={isVerified} buttonOutline={"view" == isFilled["view"] ? "button--correct" : "button--incorrect"}/>
          <ComponentPiecesDroppableArea key="data-access" buttonLayer={isFilled["data-access"] != "" ? componentToLayer[isFilled["data-access"]] : ""} buttonLabel={isFilled["data-access"]} droppableID={"data-access"} isVerified={isVerified} buttonOutline={"data-access" == isFilled["data-access"] ? "button--correct" : "button--incorrect"}/>
          <ComponentPiecesDroppableArea key="database" buttonLayer={isFilled["database"] != "" ? componentToLayer[isFilled["database"]] : ""} buttonLabel={isFilled["database"]} droppableID={"database"} isVerified={isVerified} buttonOutline={"database" == isFilled["database"] ? "button--correct" : "button--incorrect"}/>
        </div>
      </div>
      <div className={styles['legend-container']}></div>
    </div>
  </div>
  )
}