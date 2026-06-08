// components/home/StepCard.tsx
// Reusable card linking to a lesson step. Used twice on the home page.
// Props: label, image, title, description, ctaLabel, ctaHref.

import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './StepCard.module.css'

type StepCardProps = {
  label: string
  image?: ReactNode
  title: string
  description: string
  ctaLabel: string
  ctaHref?: string
}

export default function StepCard({
  label,
  image,
  title,
  description,
  ctaLabel,
  ctaHref,
}: StepCardProps) {
  const ctaContent = (
    <>
      {ctaLabel}
      <span aria-hidden="true">›</span>
    </>
  )

  const cardContent = (
    <>
      <p className={styles.stepBadge}>{label}</p>
      <div className={styles.illustration}>{image}</div>
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <span className={styles.cta}>{ctaContent}</span>
      </div>
    </>
  )

  if (ctaHref) {
    return (
      <Link className={styles.card} href={ctaHref}>
        {cardContent}
      </Link>
    )
  }

  return <article className={styles.card}>{cardContent}</article>
}
