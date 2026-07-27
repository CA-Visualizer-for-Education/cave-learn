import { CA_COMPONENTS, CA_LAYERS } from '@/lib/ca-data'
import type { LayerId } from '@/lib/ca-data'
import DependencyCard from './DependencyCard'
import styles from './ComponentSidebar.module.css'

const LAYER_COLOR_LIGHT: Record<LayerId, string> = {
  'frameworks-drivers':         'var(--color-layer-blue-light)',
  'interface-adapters':         'var(--color-layer-green-light)',
  'application-business-rules': 'var(--color-layer-pink-light)',
  'enterprise-business-rules':  'var(--color-layer-yellow-light)',
}

interface ComponentSidebarProps {
  selectedId: string | null
}

export default function ComponentSidebar({ selectedId }: ComponentSidebarProps) {
  const component = CA_COMPONENTS.find((c) => c.id === selectedId) ?? null

  if (!component) {
    return (
      <aside className={styles.sidebarEmpty}>
        <p className="text-eyebrow" style={{ textAlign: 'center' }}>
          Click on a component on the diagram to learn about it
        </p>
      </aside>
    )
  }

  const layer = CA_LAYERS[component.layer]

  const layerColor = layer.colorHex
  const layerBg = LAYER_COLOR_LIGHT[component.layer]

  return (
    <aside className={styles.sidebar} style={{ backgroundColor: layerBg, '--layer-color': layerColor } as React.CSSProperties}>
      <div className={styles.layerBadge}>
        <span className={styles.layerDot} style={{ backgroundColor: layerColor }} />
        <span className={styles.layerName} style={{ color: layerColor }}>{layer.name}</span>
      </div>

      <h1 className={styles.componentName}>{component.name}</h1>

      <div className={styles.useSection}>
        <span className={styles.useLabel}>use</span>
        <p className={styles.useDescription}>{component.description}</p>
      </div>

      {(component.dependsOn.length > 0 || component.implements.length > 0) && (
        <div className={styles.dependencyList}>
          {component.dependsOn.map((dep) => (
            <DependencyCard
              key={dep.id}
              sourceId={component.id}
              targetId={dep.id}
              reason={dep.reason}
              type="dependsOn"
            />
          ))}
          {component.implements.map((impl) => (
            <DependencyCard
              key={impl.id}
              sourceId={component.id}
              targetId={impl.id}
              reason={impl.reason}
              type="implements"
            />
          ))}
        </div>
      )}
    </aside>
  )
}
