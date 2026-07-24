'use client'

import { useState, PointerEvent } from 'react'
import { Box } from '@mui/material'
import ComponentSide from './ComponentSide/ComponentSide'
import DescriptionSide from './DescriptionSide/DescriptionSide'
import WireLayer from './Wire/WireLayer'
import { CA_COMPONENTS, CA_LAYERS } from '@/lib/ca-data'

type Point = { x: number; y: number };

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

function findPoint(element: HTMLElement): {x: number, y: number} {
  const rect = element.getBoundingClientRect();
  const y = rect.top + rect.height / 2 - 4; // 4 is half of the margin difference within the /ComponentPiece due to droppable
  return element.dataset.side === 'component' ? {x: rect.right - 1, y} : {x: rect.left + 1, y};
}

export default function MatchingExerciseBoard() {
  const [isVerified] = useState(false);
  const [wires, setWires] = useState<Array<{ componentId: string; descriptionId: string; }>>([]);
  const [currentWire, setCurrentWire] = useState<{ startPoint: Point; endPoint: Point; color: string } | null>(null);
  const [dragState, setDragState] = useState<boolean>(false);

  const handlePointerDown = (event: PointerEvent<HTMLElement>): void => {
      event.preventDefault();
      const element = (event.target as HTMLElement).closest('[data-side]')
      if (!element) return;
      setDragState(true);
      const side = element.getAttribute('data-side');
      setCurrentWire({ 
          startPoint: { ...findPoint(element as HTMLElement) }, 
          endPoint: { x: event.clientX, y: event.clientY }, 
          color: findColor(side === 'component' ? (element.getAttribute('data-id') ?? "") : "")
        });
  }

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
      event.preventDefault();
      if (dragState) {
          setCurrentWire(prev => prev ? { ...prev, endPoint: { x: event.clientX, y: event.clientY } } : null);
      }
  }

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
      const secondElement = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-side]');
      if (secondElement) {
          const firstElement = document.elementFromPoint(currentWire?.startPoint.x || 0, currentWire?.startPoint.y || 0)?.closest('[data-side]');
          const firstSide = firstElement?.getAttribute('data-side');
          const secondSide = secondElement.getAttribute('data-side');
          if (firstElement && firstSide !== secondSide) {
            if (firstSide === 'component' && secondSide === 'description') {
              const componentId = firstElement.getAttribute('data-id') ?? "";
              const descriptionId = secondElement.getAttribute('data-id') ?? "";
              setWires([
                  ...wires.filter(w => w.componentId !== componentId && w.descriptionId !== descriptionId),
                  { componentId, descriptionId }
              ]);
            } else {
              const componentId = secondElement.getAttribute('data-id') ?? "";
              const descriptionId = firstElement.getAttribute('data-id') ?? "";
              setWires([
                  ...wires.filter(w => w.componentId !== componentId && w.descriptionId !== descriptionId),
                  { componentId, descriptionId }
              ]);
            }
          }
      }
      setDragState(false);
      setCurrentWire(null);
  }

  return (
    <>
      <div style={{ display: 'flex', flex: 1, height: '100%' }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
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
