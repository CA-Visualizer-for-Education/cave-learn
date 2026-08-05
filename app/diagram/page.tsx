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

  return <main className={`page-shell ${styles.container}`}>
      {/* Left: diagram + legend */}
      <div className={styles.leftCol}>
        <p className={`text-eyebrow ${styles.eyebrow}`}>DIAGRAM · COMPONENTS & LAYERS</p>
        <p className={`text-h1 ${styles.heading}`}>Click any component to learn what it does.</p>
        <Paper elevation={4} sx={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '75vh', minHeight: 0 }}>
          <div className={styles.diagramWrap}>
            <CADiagram selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <img src={asset('/Legend.svg')} alt="Diagram legend" className={styles.legend} />
        </Paper>
      </div>

      {/* Right: component sidebar */}
      <div className={styles.sidebar}>
        <Paper elevation={0} className={styles.sidebarPaper}>
          <ComponentSidebar selectedId={selectedId} />
        </Paper>
      </div>
  </main>
}
