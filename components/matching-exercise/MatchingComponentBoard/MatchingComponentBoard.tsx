'use client'
// components/matching-exercise/MatchingComponentBoard/MatchingComponentBoard.tsx
// The two columns of the matching board plus the wire layer drawn between them.
// Wires are stored by piece id (see types.ts) and only resolved to pixel
// coordinates at render time, so this file owns all of the DOM measuring.
import { useEffect, useState, PointerEvent } from 'react'
import { Box } from '@mui/material'
import ComponentSide from '../ComponentSide/ComponentSide'
import DescriptionSide from '../DescriptionSide/DescriptionSide'
import WireLayer from '../Wire/WireLayer'
import type { Anchor, Point, Wire, WireSegment } from '../types'
import type { VerificationStatus } from '../../common/ComponentPieces/ComponentPieces'
import { CA_COMPONENTS, CA_LAYERS } from '@/lib/ca-data'
import styles from './MatchingComponentBoard.module.css'

/*
wires: every connection the user has drawn; owned by MatchingExerciseBoard.
onConnect: reports a newly drawn wire so the owner can record it.
isVerified: whether "Check my work" has been pressed.
componentStatuses / descriptionStatuses: per-id correctness, only applied once verified.
*/
interface MatchingComponentBoardProps {
  wires: Wire[];
  onConnect(wire: Wire): void;
  isVerified: boolean;
  componentStatuses: Record<string, VerificationStatus>;
  descriptionStatuses: Record<string, VerificationStatus>;
}

/** The wire colour for a component: its layer colour, or the description fill when there is no component. */
function findColor(componentId: string | null) {
  const component = CA_COMPONENTS.find(c => c.id === componentId);
  return component ? CA_LAYERS[component.layer].colorHex : '#e6dfd6'; // pearl-brush colour on figma and same fill as descriptions
}

/** Resolve stored wires into drawable segments by measuring the pieces they connect. */
function toSegments(wires: Wire[]): WireSegment[] {
  const segments: WireSegment[] = [];
  if (typeof document === 'undefined') return segments; // nothing to measure while server rendering
  for (const wire of wires) {
    const componentElement = document.querySelector(`[data-side="component"][data-id="${wire.componentId}"]`) as HTMLElement | null;
    const descriptionElement = document.querySelector(`[data-side="description"][data-id="${wire.descriptionId}"]`) as HTMLElement | null;
    if (componentElement && descriptionElement) {
      segments.push({
        id: `${wire.componentId}->${wire.descriptionId}`,
        startPoint: findPoint(componentElement),
        endPoint: findPoint(descriptionElement),
        color: findColor(wire.componentId),
      });
    } else {
      console.warn('Could not find both ends of wire while drawing:', wire);
    }
  }
  return segments;
}

/** Given a piece element, return the point on its inner edge where a wire should attach. */
function findPoint(element: Element): Point {
  const rect = element.getBoundingClientRect();
  const y = rect.top + rect.height / 2 - 4; // 4 is half of the margin difference within the /ComponentPiece due to droppable
  return element.getAttribute('data-side') === 'component' ? {x: rect.right - 1, y} : {x: rect.left + 1, y};
}

/** Given a cursor point, return the piece element under it, or null when no drag is in progress. */
function findSnapTarget(point: Point, origin: Anchor | null): Element | null {
  if (!origin) return null;
  const element = document.elementFromPoint(point.x, point.y)?.closest('[data-side]');
  if (!element) return null;
  return element;
}

/** Read the side/id data attributes off a piece element, or null if it is not a wire endpoint. */
function findAnchor(element: Element | null | undefined): Anchor | null {
  const side = element?.getAttribute('data-side');
  const id = element?.getAttribute('data-id');
  if (!id || (side !== 'component' && side !== 'description')) return null;
  return { side, id };
}

export default function MatchingComponentBoard({ wires, onConnect, isVerified, componentStatuses, descriptionStatuses }: MatchingComponentBoardProps) {
  const [currentWire, setCurrentWire] = useState<WireSegment | null>(null);
  const [dragOrigin, setDragOrigin] = useState<Anchor | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLElement>): void => {
      const element = (event.target as HTMLElement).closest('[data-side]');
      const origin = findAnchor(element);
      if (!element || !origin) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragOrigin(origin);
      setCurrentWire({
          id: 'in-progress',
          startPoint: findPoint(element),
          endPoint: { x: event.clientX, y: event.clientY },
          color: findColor(origin.side === 'component' ? origin.id : null)
        });
  }

  /** Track the pointer with the in-progress wire, snapping its free end to any piece underneath. */
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
      if (!dragOrigin) return;
      event.preventDefault();
      const cursor = { x: event.clientX, y: event.clientY };
      const target = findSnapTarget(cursor, dragOrigin);
      const endPoint = target ? findPoint(target) : cursor;
      setCurrentWire(prev => prev ? { ...prev, endPoint } : null);
  }

  /** Commit the wire if it landed on a piece in the opposite column, then clear the drag state. */
  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
      const secondElement = findSnapTarget({ x: event.clientX, y: event.clientY }, dragOrigin);
      const target = findAnchor(secondElement);
      if (dragOrigin && target && dragOrigin.side !== target.side) {
        onConnect({
          componentId: dragOrigin.side === 'component' ? dragOrigin.id : target.id,
          descriptionId: dragOrigin.side === 'component' ? target.id : dragOrigin.id,
        });
      }
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setDragOrigin(null);
      setCurrentWire(null);
  }

  return (
    <div className={styles['board']} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
      <Box className={styles['board--component-column']}>
        <ComponentSide isVerified={isVerified} statuses={componentStatuses} />
      </Box>
      <Box className={styles['board--spacer-column']}></Box>
      <WireLayer wires={toSegments(wires)} currentWire={currentWire} />
      <Box className={styles['board--description-column']}>
        <DescriptionSide isVerified={isVerified} statuses={descriptionStatuses} />
      </Box>
    </div>
  )
}
