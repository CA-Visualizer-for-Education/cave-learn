import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import { CA_COMPONENTS, CA_LAYERS } from '@/lib/ca-data'
import styles from './DependencyCard.module.css'

interface DependencyCardProps {
  sourceId: string
  targetId: string
  reason: string
  type: 'dependsOn' | 'implements'
}

function chipStyle(id: string): { backgroundColor: string; color: string } {
  const component = CA_COMPONENTS.find((c) => c.id === id)
  if (!component) return { backgroundColor: '#686760', color: '#fff' }
  const { colorHex } = CA_LAYERS[component.layer]
  const color = component.layer === 'enterprise-business-rules' ? '#1A1A1F' : '#fff'
  return { backgroundColor: colorHex, color }
}

function NodeChip({ id }: { id: string }) {
  const component = CA_COMPONENTS.find((c) => c.id === id)
  return (
    <span className={styles.chip} style={chipStyle(id)}>
      {component?.name ?? id}
    </span>
  )
}

function Arrow({ type }: { type: 'dependsOn' | 'implements' }) {
  const Icon = type === 'dependsOn' ? PlayArrowIcon : PlayArrowOutlinedIcon
  return (
    <span className={styles.arrow}>
      <Icon fontSize="small" />
    </span>
  )
}

export default function DependencyCard({ sourceId, targetId, reason, type }: DependencyCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.arrowRow}>
        <Arrow type={type} />
        <NodeChip id={targetId} />
      </div>
      <p className={styles.reason}>{reason}</p>
    </div>
  )
}
