// components/diagram/CADiagram.tsx
// Interactive Clean Architecture diagram.
// Renders CA_LAYERS as rectangles and CA_COMPONENTS as clickable boxes.
// Props: selectedId (string | null), onSelect ((id: string | null) => void)

import { CA_COMPONENTS, CA_LAYERS } from '@/lib/ca-data'

interface CADiagramProps {
  selectedId: string | null
  onSelect: (id: string | null) => void
}

const CANVAS_WIDTH = 920
const CANVAS_HEIGHT = 560

const LAYER_BOUNDS = {
  'frameworks-drivers': { x: 36, y: 36, width: 848, height: 488 },
  'interface-adapters': { x: 60, y: 76, width: 800, height: 408 },
  'application-business-rules': { x: 84, y: 116, width: 752, height: 328 },
  'enterprise-business-rules': { x: 108, y: 156, width: 704, height: 248 },
} as const

interface ContainerSvgProps {
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: string
  shadowId: string
}

function OuterContainerSvg() {
  return (
    <svg
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      role="img"
      aria-label="Clean Architecture container diagram background"
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <filter id="outer-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="rgba(0, 0, 0, 0.12)" />
        </filter>
      </defs>
      <rect
        x="12"
        y="12"
        width={CANVAS_WIDTH - 24}
        height={CANVAS_HEIGHT - 24}
        rx="28"
        ry="28"
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth="2"
        filter="url(#outer-shadow)"
      />
    </svg>
  )
}

function LayerContainerSvg({
  x,
  y,
  width,
  height,
  fill,
  stroke,
  shadowId,
}: ContainerSvgProps) {
  return (
    <svg
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <defs>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0, 0, 0, 0.10)" />
        </filter>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="24"
        ry="24"
        fill={fill}
        fillOpacity="0.16"
        stroke={stroke}
        strokeWidth="2"
        filter={`url(#${shadowId})`}
      />
    </svg>
  )
}

function FrameworksContainerSvg() {
  return (
    <LayerContainerSvg
      x={36}
      y={36}
      width={848}
      height={488}
      fill={CA_LAYERS['frameworks-drivers'].colorHex}
      stroke={CA_LAYERS['frameworks-drivers'].colorHex}
      shadowId="frameworks-shadow"
    />
  )
}

function InterfaceAdaptersContainerSvg() {
  return (
    <LayerContainerSvg
      x={60}
      y={76}
      width={800}
      height={408}
      fill={CA_LAYERS['interface-adapters'].colorHex}
      stroke={CA_LAYERS['interface-adapters'].colorHex}
      shadowId="adapters-shadow"
    />
  )
}

function ApplicationBusinessRulesContainerSvg() {
  return (
    <LayerContainerSvg
      x={84}
      y={116}
      width={752}
      height={328}
      fill={CA_LAYERS['application-business-rules'].colorHex}
      stroke={CA_LAYERS['application-business-rules'].colorHex}
      shadowId="application-shadow"
    />
  )
}

function EnterpriseBusinessRulesContainerSvg() {
  return (
    <LayerContainerSvg
      x={108}
      y={156}
      width={704}
      height={248}
      fill={CA_LAYERS['enterprise-business-rules'].colorHex}
      stroke={CA_LAYERS['enterprise-business-rules'].colorHex}
      shadowId="enterprise-shadow"
    />
  )
}

export default function CADiagram({ selectedId, onSelect }: CADiagramProps) {
  const selectedComponent = CA_COMPONENTS.find((component) => component.id === selectedId) ?? null
  const selectedLayer = selectedComponent ? CA_LAYERS[selectedComponent.layer] : null
  const selectedBounds = selectedComponent ? LAYER_BOUNDS[selectedComponent.layer] : null

  return (
    <div
      onClick={() => onSelect(null)}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: `${CANVAS_WIDTH}px`,
        aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
        margin: '0 auto',
      }}
    >
      <OuterContainerSvg />
      <FrameworksContainerSvg />
      <InterfaceAdaptersContainerSvg />
      <ApplicationBusinessRulesContainerSvg />
      <EnterpriseBusinessRulesContainerSvg />
      {selectedLayer && selectedBounds ? (
        <svg
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <rect
            x={selectedBounds.x}
            y={selectedBounds.y}
            width={selectedBounds.width}
            height={selectedBounds.height}
            rx="24"
            ry="24"
            fill="none"
            stroke={selectedLayer.colorHex}
            strokeWidth="5"
            strokeDasharray="12 8"
          />
        </svg>
      ) : null}
    </div>
  )
}
