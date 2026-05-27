// components/diagram/CADiagram.tsx
// Interactive Clean Architecture diagram.
// Renders the diagram background containers and keeps the click-to-clear behavior.

import { createCAContainerSvg } from '@/components/diagram/CAContainerSvgs'

interface CADiagramProps {
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export default function CADiagram({ selectedId, onSelect }: CADiagramProps) {
  void selectedId

  return <div onClick={() => onSelect(null)}>{createCAContainerSvg()}</div>
}
