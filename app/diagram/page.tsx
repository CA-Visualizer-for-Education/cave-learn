// app/diagram/page.tsx — Diagram page (route: /diagram)
// Two-column layout: CADiagram + DiagramLegend on the left, ComponentSidebar on the right.
// Owns selectedId state and passes it down to both children.

'use client'

import { useState } from 'react'
import CADiagram from '@/components/diagram/CADiagram'
import ComponentSidebar from '@/components/diagram/ComponentSidebar'
import Paper from '@mui/material/Paper'
import { asset } from '@/lib/asset'
import styles from './page.module.css'

export default function DiagramPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return <main className="page-shell" style={{ display: 'flex', alignItems: 'flex-start', minWidth: 0, overflow: 'hidden'}}>
      {/* Left: diagram + legend */}
      <div className={styles.leftCol} style={{ minWidth: 0, flex: 1 }}>
        <p className={`text-eyebrow ${styles.eyebrow}`}>DIAGRAM · COMPONENTS & LAYERS</p>
        <p className={`text-h1 ${styles.heading}`}>Click any component to learn what it does.</p>
        <Paper elevation={4} sx={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '75vh' }}>
          <div className={styles.diagramWrap}>
            <CADiagram selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <img src={asset('/Legend.svg')} alt="Diagram legend" className={styles.legend} />
        </Paper>
      </div>

      {/* Right: component sidebar */}
      <Paper elevation={0} sx={{ width: '25rem', minWidth: '16rem', maxWidth: '30rem', flexShrink: 0, height: 'calc(100vh - var(--navbar-height))', overflowX: 'auto', overflowY: 'hidden', position: 'sticky', top: 'var(--navbar-height)' }}>
        <ComponentSidebar selectedId={selectedId} />
      </Paper>
  </main>
}
