// components/home/HeroSection.tsx
// Hero block at the top of the home page.
// Contains: eyebrow label, logo mark, headline, subtitle, stats chips.
// Stats data lives in ca-data.ts — import CA_LAYERS for the dot colors.

import { CA_LAYERS }from '@/lib/ca-data'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  return (
        <section className={`${styles.section} content-area`}>
            <h1 className={`${styles.headline} text-display`}>
                Learn <span className={styles.headlineAccent}>Clean Architecture</span>
            </h1>
            <p className={`${styles.subtitle} text-body`}>
                Two Interactive ways to learn clean architecture
            </p>

            <div className={styles.statsRow}>
                <div className={styles.statChip}>
                    <span className={styles.statDot}
                          style={{ backgroundColor: CA_LAYERS['interface-adapters'].colorHex }}/>
                    <span className={styles.statChipText}>4 Layers</span>
                </div>

                <div className={styles.statChip}>
                    <span className={styles.statDot}
                          style={{ backgroundColor: CA_LAYERS['frameworks-drivers'].colorHex }}/>
                    <span className={styles.statChipText}>13 Components</span>
                </div>

                <div className={styles.statChip}>
                    <span className={styles.statDot}
                          style={{ backgroundColor: CA_LAYERS['application-business-rules'].colorHex }}/>
                    <span className={styles.statChipText}>1 Dependency Rule</span>
                </div>

            </div>

        </section>
  )
}
