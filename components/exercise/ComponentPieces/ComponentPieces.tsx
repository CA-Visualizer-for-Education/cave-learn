'use client'
// components/exercise/ComponentPieces/ComponentPieces.tsx
// Right-hand panel showing the draggable CA component chips to be placed on the board.
import { type LayerId } from "@/lib/ca-data";
import styles from './ComponentPieces.module.css';
import { useDraggable } from "@dnd-kit/react"

/*
label: Represents what component of clean architecture the button represents and is used as its id.
layer: Represents what layer of clean architecture the button represents.
inDroppable: Is true if the button is to be placed in a droppable area.
buttonOutline: Is either "button--correct" if the button is in the right droppable area or "button-incorrect" otherwise.
isVerified: Whether or not the current board has been verified (check work has been clicked).
*/
interface ComponentPiecesProps {
  label: string;
  layer: string;
  inDroppable: boolean;
  buttonOutline: string;
  isVerified: boolean;
}

const capitalizeWords = (words : string) : string => {
  const wordsSplit = words.split("-");
  let newLabel : string = "";
  for(const word of wordsSplit){
    newLabel = newLabel + word[0].toUpperCase() + word.substring(1) + " ";
  }
  return newLabel.substring(0, newLabel.length - 1);
}

const getSubLabel = (label : string) : string => {
  if(label == "input-data" || label == "view-model" || label == "output-data"){
    return '<DS>'
  }else if(label == "input-boundary" || label == "output-boundary" || label == "data-access-interface"){
    return '<I>'
  }
  return "";
}

const layerToBadge : Record<LayerId, string> = {
  'interface-adapters' : "badge badge--green",
  'application-business-rules' : "badge badge--pink",
  'enterprise-business-rules' : "badge badge--yellow",
  'frameworks-drivers' : "badge badge--blue"
}

export default function ComponentPieces({ label, layer, inDroppable, buttonOutline, isVerified } : ComponentPiecesProps) {
  // const {ref} = useDraggable({ id: label }) is removed from here to prevent unnecessary ids from being created if a button is not draggable
  
  /* If the button is in droppable, we need to move the entire button up the height equivalent to the height of the sublabel. 
     If isVerified, we don't care what inDroppable is since it is assumed that only components are in the droppable.
  */
  return (isVerified ?
    <button type="button" className={`${styles['individual-button--container']} ${styles['button--in-droppable']}`}>
      {getSubLabel(label) != "" ? <div className={styles['button--sublabel']}>{getSubLabel(label)}</div> : <div className={styles['button--no-sublabel']}></div>}
      <div className={inDroppable ? `${layerToBadge[layer as LayerId]} ${styles['exercise--button']} ${styles['button--main-label']} ${styles['exercise--button-in-droppable']} ${styles[buttonOutline]}` : `${layerToBadge[layer as LayerId]} ${styles['exercise--button']} ${styles['button--main-label']}`}>
        {capitalizeWords(label)}
      </div>
    </button>
    :
    <button type="button" className={inDroppable ? `${styles['individual-button--container']} ${styles['button--in-droppable']}` : styles['individual-button--container']} ref={useDraggable({ id: label }).ref}>
      {getSubLabel(label) != "" ? <div className={styles['button--sublabel']}>{getSubLabel(label)}</div> : <div className={styles['button--no-sublabel']}></div>}
      <div className={inDroppable ? `${layerToBadge[layer as LayerId]} ${styles['exercise--button']} ${styles['button--main-label']} ${styles['exercise--button-in-droppable']}` : `${layerToBadge[layer as LayerId]} ${styles['exercise--button']} ${styles['button--main-label']}`}>
        {capitalizeWords(label)}
      </div>
    </button>
  )
}
