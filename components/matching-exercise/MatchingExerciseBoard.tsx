'use client'

import { useState, PointerEvent } from 'react'
import { Box } from '@mui/material'
import ComponentSide from './ComponentSide/ComponentSide'
import DescriptionSide from './DescriptionSide/DescriptionSide'
import WireLayer from './Wire/WireLayer'
import { CA_COMPONENTS, CA_LAYERS } from '@/lib/ca-data'

type Point = { x: number; y: number };
type Side = 'component' | 'description';
type Anchor = { side: Side; id: string };

function findColor(componentId: string) {
  const component = CA_COMPONENTS.find(c => c.id === componentId);
  return component ? CA_LAYERS[component.layer].colorHex : '#e6dfd6'; // pearl-brush colour on figma and same fill as descriptions
}

function toPoints(wires: Array<{ componentId: string; descriptionId: string; }>): Array<{ startPoint: Point; endPoint: Point; color: string }> {
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

function findPoint(element: Element): Point {
  const rect = element.getBoundingClientRect();
  const y = rect.top + rect.height / 2 - 4; // 4 is half of the margin difference within the /ComponentPiece due to droppable
  return element.getAttribute('data-side') === 'component' ? {x: rect.right - 1, y} : {x: rect.left + 1, y};
}

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

export default function MatchingExerciseBoard() {
  const [isVerified] = useState(false);
  const [wires, setWires] = useState<Array<{ componentId: string; descriptionId: string; }>>([]);
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
      const target = findAnchor(findSnapTarget({ x: event.clientX, y: event.clientY }, dragOrigin));
      if (dragOrigin && target) {
          const componentId = dragOrigin.side === 'component' ? dragOrigin.id : target.id;
          const descriptionId = dragOrigin.side === 'component' ? target.id : dragOrigin.id;
          setWires(prev => [
              ...prev.filter(w => w.componentId !== componentId && w.descriptionId !== descriptionId),
              { componentId, descriptionId }
          ]);
      }
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setDragOrigin(null);
      setCurrentWire(null);
  }

  return (
    <>
      {/* touchAction: 'none' stops a touch drag from being stolen by the scroller mid-wire. */}
      <div style={{ display: 'flex', flex: 1, height: '100%', touchAction: 'none' }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
          <ComponentSide isVerified={isVerified} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 2 }}></Box>
        <WireLayer wires={toPoints(wires)} currentWire={currentWire} />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 5 }}>
          <DescriptionSide isVerified={isVerified} />
        </Box>
      </div>
    </>
  )
}
