"use client";
// components/common/ComponentPieces/ComponentPieces.tsx
// A single CA component chip. Shared by both exercises: the fill-in-the-diagram
// board drags these into droppables, the matching board wires them up in place.
import { type LayerId } from "@/lib/ca-data";
import styles from "./ComponentPieces.module.css";
import { useDraggable } from "@dnd-kit/react";

const capitalizeWords = (words: string): string => {
  const wordsSplit = words.split("-");
  let newLabel: string = "";
  for (const word of wordsSplit) {
    newLabel = newLabel + word[0].toUpperCase() + word.substring(1) + " ";
  }
  return newLabel.substring(0, newLabel.length - 1);
};

const getSubLabel = (label: string): string => {
  if (
    label == "input-data" ||
    label == "view-model" ||
    label == "output-data"
  ) {
    return "<DS>";
  } else if (
    label == "input-boundary" ||
    label == "output-boundary" ||
    label == "data-access-interface"
  ) {
    return "<I>";
  }
  return "";
};

const layerToBadge: Record<LayerId, string> = {
  "interface-adapters": "badge badge--green",
  "application-business-rules": "badge badge--pink",
  "enterprise-business-rules": "badge badge--yellow",
  "frameworks-drivers": "badge badge--blue",
};

type PieceLocation = "sidebar" | "diagram";

export type VerificationStatus =
  | "unverified"
  | "verified-correct"
  | "verified-incorrect";

/*
  label: The component of clean architecture the button represents
    - is also used as its id
  layer: The layer of clean architecture the button represents
  currentLayer: The droppable CA layer the button is currently in
    - is an empty string if the button is not in a droppable
  verificationStatus: Status of the component within the board (controls styling)
  draggable: Whether the chip can be picked up. The matching exercise renders chips
    that are wired up rather than dragged, so it opts out.
*/
interface ComponentPiecesProps {
  label: string;
  layer: string;
  currentLayer: string;
  verificationStatus: VerificationStatus;
  draggable?: boolean;
}

export function ComponentPieces({
  label,
  layer,
  currentLayer,
  verificationStatus,
  draggable = true,
}: ComponentPiecesProps) {
  /* If the button is in droppable, we need to move the entire button up the height equivalent to the height of the sublabel. 
     If isVerified, we don't care what inDroppable is since it is assumed that only components are in the droppable.
  */

  const isVerified =
    verificationStatus === "verified-correct" ||
    verificationStatus === "verified-incorrect";

  const location: PieceLocation = currentLayer === "" ? "sidebar" : "diagram";
  const subLabel = getSubLabel(label);

  const badgeClass =
    location === "diagram"
      ? layerToBadge[currentLayer as LayerId]
      : "badge badge--neutral";

  const buttonOutline = (() => {
    if (location === "sidebar") {
      return "button--neutral";
    }
    switch (verificationStatus) {
      case "unverified":
        return ""; // no border
      case "verified-correct":
        return "button--correct";
      case "verified-incorrect":
        return "button--incorrect";
      default:
        // did not handle a valid verificationStatus
        // create a compile-time error
        const exhaustiveCheck: never = verificationStatus;

        // runtime error
        throw new Error(`Unhandled verification status: ${exhaustiveCheck}`);
    }
  })();

  // Called unconditionally to keep the hook order stable across verification;
  // only the ref is withheld when the chip should not be picked up.
  const { ref } = useDraggable({ id: label });

  const mainLabelClasses = [
    badgeClass,
    styles["exercise--button"],
    styles["button--main-label"],
    styles[buttonOutline],
    location === "diagram" && styles["exercise--button-in-droppable"],
  ]
    .filter(Boolean)
    .join(" ");

  const containerClasses = [
    styles["individual-button--container"],
    location === "diagram" && styles["button--in-droppable"],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={containerClasses}
      ref={draggable && !isVerified ? ref : undefined}
    >
      {subLabel !== "" ? (
        <div className={styles["button--sublabel"]}>{subLabel}</div>
      ) : (
        <div className={styles["button--no-sublabel"]}></div>
      )}
      <div className={mainLabelClasses}>{capitalizeWords(label)}</div>
    </button>
  );
}
