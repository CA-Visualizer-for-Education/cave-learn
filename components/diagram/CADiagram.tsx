'use client'

import { CA_COMPONENTS } from '@/lib/ca-data'
import { asset } from '@/lib/asset'
import { DiagramNode } from './DiagramNode'
import ManhattanArrow from './ManhattanArrow'

interface CADiagramProps {
  selectedId: string | null
  onSelect: (id: string | null) => void
}

// Diagram canvas dimensions — must match the SVG viewBox
const W = 894
const H = 553
const SCALE = 1.05

// Center (x, y) for each node in the 894x553 coordinate space
const POSITIONS: Record<string, { x: number; y: number }> = {
  'controller':            { x: 137, y: 129},
  'presenter':             { x: 137, y: 230 },
  'view-model':            { x: 137, y: 342 },
  'input-data':            { x: 360, y: 105 },
  'input-boundary':        { x: 360, y: 165 },
  'use-case-interactor':   { x: 520, y: 198 },
  'output-boundary':       { x: 360, y: 235},
  'output-data':           { x: 360, y: 305 },
  'entities':              { x: 740, y: 131},
  'data-access-interface': { x: 755, y: 317 },
  'view':                  { x: 137, y: 469 },
  'data-access':           { x: 540, y: 469 },
  'database':              { x: 754, y: 469 },
}

const NODE_W = 150
const NODE_H = 33
const PAD = 8

// Arrows derived from CA_COMPONENTS connections — each path ends at the arrowhead
const ARROWS = [
  // view → view-model (depends)
  { start: { x: 160, y: 466 }, path: [{ direction: 'up' as const, length: 100 }], type: 'dependency' as const, rotation: 270 as const },
  // view → controller (depends, goes left side of green region)
  { start: { x: 71, y: 485 }, path: [{ direction: 'left' as const, length: 19 },{ direction: 'up' as const, length: 382 }, { direction: 'right' as const, length: 13}], type: 'dependency' as const, rotation: 0 as const },
  // controller → input-data (depends)
  { start: { x: 160, y: 85 }, path: [{ direction: 'up' as const, length: 10 }, { direction: 'right' as const, length: 154 }], type: 'dependency' as const, rotation: 0 as const },
  // controller → input-boundary (depends)
  { start: { x: 160, y: 120 }, path: [{ direction: 'down' as const, length: 23 }, { direction: 'right' as const, length: 154}], type: 'dependency' as const, rotation: 0 as const },
  // presenter → view-model (depends)
  { start: { x: 160, y: 233 }, path: [{ direction: 'down' as const, length: 85 }], type: 'dependency' as const, rotation: 90 as const },
  // presenter → output-data (depends)
  { start: { x: 160, y: 300 }, path: [{ direction: 'right' as const, length: 28 }, { direction: 'right' as const, length: 126 }], type: 'dependency' as const, rotation: 0 as const },
  // presenter → output-boundary (implements)
  { start: { x: 246, y: 217 }, path: [{ direction: 'right' as const, length: 31 }, { direction: 'down' as const, length: 3 }, { direction: 'right' as const, length: 40}], type: 'implements' as const, rotation: 0 as const },
  // use-case-interactor → input-boundary (implements)
  { start: { x: 600, y: 144 }, path: [{ direction: 'left' as const, length: 97 }], type: 'implements' as const, rotation: 180 as const },
  // use-case-interactor → output-boundary (depends)
  { start: { x: 600, y: 198 }, path: [{ direction: 'down' as const, length: 25 }, { direction: 'left' as const, length: 97 }], type: 'dependency' as const, rotation: 180 as const },
  // use-case-interactor → input-data (depends, goes through top)
  { start: { x: 600, y: 162 }, path: [{ direction: 'up' as const, length: 87 }, { direction: 'left' as const, length: 98 }], type: 'dependency' as const, rotation: 180 as const },
  // use-case-interactor → output-data (depends, goes through bottom)
  { start: { x: 600, y: 198 }, path: [{ direction: 'down' as const, length: 105 }, { direction: 'left' as const, length: 98}], type: 'dependency' as const, rotation: 180 as const },
  // use-case-interactor → entities (depends)
  { start: { x: 677, y: 180 }, path: [{ direction: 'right' as const, length: 165 }, { direction: 'up' as const, length: 52}], type: 'dependency' as const, rotation: 270 as const },
  // use-case-interactor → data-access-interface (depends)
  { start: { x: 600, y: 255 }, path: [{ direction: 'right' as const, length: 250 }, { direction: 'down' as const, length: 35 }], type: 'dependency' as const, rotation: 90 as const },
  // data-access → database (depends)
  { start: { x: 699, y: 482 }, path: [{ direction: 'right' as const, length: 57 }], type: 'dependency' as const, rotation: 0 as const },
  // data-access → data-access-interface (implements)
  { start: { x: 600, y: 464 }, path: [{direction: 'up' as const, length: 12 }, { direction: 'right' as const, length: 250 }, { direction: 'up' as const, length: 116 }], type: 'implements' as const, rotation: 270 as const },
]

export default function CADiagram({ selectedId, onSelect }: CADiagramProps) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: W * SCALE, height: H * SCALE, flexShrink: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: W, height: H, transform: `scale(${SCALE})`, transformOrigin: 'top left' }}>
        {/* SVG background */}
        <img
          src={asset('/diagrambackground.svg')}
          alt=""
          style={{ position: 'absolute', top: 0, left: 0, width: W, height: H, pointerEvents: 'none' }}
        />

        {/* Layer labels */}
        {[
          { label: 'Interface Adapters',  x: 55,  y: 40,  color: '#236334' },
          { label: 'Application Business Rules', x: 280, y: 40,  color: '#941B45' },
          { label: 'Enterprise Business Rules',  x: 640, y: 40,  color: '#8B6A00' },
          { label: 'Frameworks & Drivers',       x: 265,  y: 458, color: '#1F4E8A' },
        ].map(({ label, x, y, color }) => (
          <span key={label} style={{
            position: 'absolute', left: x, top: y,
            fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
            color, pointerEvents: 'none',
          }}>{label}</span>
        ))}

        {/* Arrows */}
        {ARROWS.map((arrow, i) => (
          <ManhattanArrow key={i} {...arrow} />
        ))}

        {/* Nodes */}
        {Object.entries(POSITIONS).map(([id, { x, y }]) => {
          const component = CA_COMPONENTS.find(c => c.id === id)
          if (!component) return null
          return (
            <div
              key={id}
              style={{
                position: 'absolute',
                left: x - NODE_W / 2 - PAD,
                top: y - NODE_H / 2 - PAD,
              }}
            >
              <DiagramNode
                label={component!.name}
                isSelected={selectedId === id}
                onClick={() => onSelect(selectedId === id ? null : id)}
              />
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}
