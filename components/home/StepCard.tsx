import Link from 'next/link'
import { asset } from '@/lib/asset'
import styles from './StepCard.module.css'

interface StepCardProps {
  variant: 'learn' | 'test'
  illustrationSrc: string
  illustrationAlt: string
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
}

const VARIANTS = {
  learn: {
    badge: 'LEARN',
    badgeBg: '#EBF4FC',
    badgeColor: '#207FD4',
    ctaColor: 'var(--color-brand-blue)',
  },
  test: {
    badge: 'TEST',
    badgeBg: '#FCEDF3',
    badgeColor: '#E2477C',
    ctaColor: 'var(--color-brand-pink)',
  },
}

export default function StepCard({ variant, illustrationSrc, illustrationAlt, title, description, ctaLabel, ctaHref }: StepCardProps) {
  const v = VARIANTS[variant]

  return (
    <Link href={ctaHref} className={styles.card}>
      <div className={styles.illustration}>
        <span className={styles.stepBadge} style={{ backgroundColor: v.badgeBg, color: v.badgeColor }}>
          {v.badge}
        </span>
        <div className={styles.illustrationInner}>
          <img src={asset(illustrationSrc)} alt={illustrationAlt} className={styles.illustrationImg} />
        </div>
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <span className={styles.cta} style={{ color: v.ctaColor }}>
          {ctaLabel} <span aria-hidden>›</span>
        </span>
      </div>
    </Link>
  )
}
