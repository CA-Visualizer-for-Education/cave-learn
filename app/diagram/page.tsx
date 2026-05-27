// app/diagram/page.tsx — Diagram page (route: /diagram)
// Two-column layout: CADiagram + DiagramLegend on the left, ComponentSidebar on the right.
// Owns selectedId state and passes it down to both children.

'use client'

import { useState } from 'react'
import CADiagram from '@/components/diagram/CADiagram'
import DiagramLegend from '@/components/diagram/DiagramLegend'
import ComponentSidebar from '@/components/diagram/ComponentSidebar'

export default function DiagramPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <main className="page-shell">
      <div>
        <CADiagram selectedId={selectedId} onSelect={setSelectedId} />
        <DiagramLegend />
      </div>
      <ComponentSidebar selectedId={selectedId} />
    </main>
  )
}
