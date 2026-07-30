'use client'

import { useState, PointerEvent } from 'react'
import { Box } from '@mui/material'
import ComponentSide from '../ComponentSide/ComponentSide'
import DescriptionSide from '../DescriptionSide/DescriptionSide'
import WireLayer from '../Wire/WireLayer'
import { CA_COMPONENTS, CA_LAYERS } from '@/lib/ca-data'
import styles from './MatchingComponentBoard.module.css'

export type Wire = { componentId: string; descriptionId: string };

type Point = { x: number; y: number };
type Side = 'component' | 'description';
type Anchor = { side: Side; id: string };

/*
wires: every connection the user has drawn; owned by MatchingExerciseBoard.
onConnect: reports a newly drawn wire so the owner can record it.
isVerified: whether "Check my work" has been pressed.
componentOutlines / descriptionOutlines: per-id correctness classes, only rendered once verified.
*/
interface MatchingComponentBoardProps {
  wires: Wire[];
  onConnect(wire: Wire): void;
  isVerified: boolean;
  componentOutlines: Record<string, string>;
  descriptionOutlines: Record<string, string>;
}

function findColor(componentId: string) {
  const component = CA_COMPONENTS.find(c => c.id === componentId);
  return component ? CA_LAYERS[component.layer].colorHex : '#e6dfd6'; // pearl-brush colour on figma and same fill as descriptions
}

function toPoints(wires: Wire[]): Array<{ startPoint: Point; endPoint: Point; color: string }> {
  const points: Array<{ startPoint: Point; endPoint: Point; color: string }> = [];
  for (const wire of wires) {
    const componentElement = document.querySelector(`[data-side="component"][data-id="${wire.componentId}"]`) as HTMLElement | null;
    const descriptionElement = document.querySelector(`[data-side="description"][data-id="${wire.descriptionId}"]`) as HTMLElement | null;
    if (componentElement && descriptionElement) {
      const startPoint = findPoint(componentElement);
      const endPoint = findPoint(descriptionElement);
      points.push({ startPoint, endPoint, color: findColor(wire.componentId) });
    } else {
      console.warn('wu oh ... could not find elements for wire:', wire);
    }
  }
  return points;
}

// given an element, return the point where the wire should attach
function findPoint(element: Element): Point {
  const rect = element.getBoundingClientRect();
  const y = rect.top + rect.height / 2 - 4; // 4 is half of the margin difference within the /ComponentPiece due to droppable
  return element.getAttribute('data-side') === 'component' ? {x: rect.right - 1, y} : {x: rect.left + 1, y};
}

// given a point, find the element to snap to (or null if not over an element)
function findSnapTarget(point: Point, origin: Anchor | null): Element | null {
  if (!origin) return null;
  const element = document.elementFromPoint(point.x, point.y)?.closest('[data-side]');
  if (!element) return null;
  return element;
}

function findAnchor(element: Element | null | undefined): Anchor | null {
  const side = element?.getAttribute('data-side');
  const id = element?.getAttribute('data-id');
  if (!id || (side !== 'component' && side !== 'description')) return null;
  return { side, id };
}

export default function MatchingComponentBoard({ wires, onConnect, isVerified, componentOutlines, descriptionOutlines }: MatchingComponentBoardProps) {
  const [currentWire, setCurrentWire] = useState<{ startPoint: Point; endPoint: Point; color: string } | null>(null);
  const [dragOrigin, setDragOrigin] = useState<Anchor | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLElement>): void => {
      const element = (event.target as HTMLElement).closest('[data-side]');
      const origin = findAnchor(element);
      if (!element || !origin) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragOrigin(origin);
      setCurrentWire({
          startPoint: findPoint(element),
          endPoint: { x: event.clientX, y: event.clientY },
          color: findColor(origin.side === 'component' ? origin.id : "")
        });
  }

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
      if (!dragOrigin) return;
      event.preventDefault();
      const cursor = { x: event.clientX, y: event.clientY };
      const target = findSnapTarget(cursor, dragOrigin);
      const endPoint = target ? findPoint(target) : cursor;
      setCurrentWire(prev => prev ? { ...prev, endPoint } : null);
  }

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
    <>
      <div className={styles['board']} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
        <Box className={styles['board--component-column']}>
          <ComponentSide isVerified={isVerified} outlines={componentOutlines} />
        </Box>
        <Box className={styles['board--spacer-column']}></Box>
        <WireLayer wires={toPoints(wires)} currentWire={currentWire} />
        <Box className={styles['board--description-column']}>
          <DescriptionSide isVerified={isVerified} outlines={descriptionOutlines} />
        </Box>
      </div>
    </>
  )
}
