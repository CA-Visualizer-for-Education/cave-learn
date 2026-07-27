// app/page.tsx  —  Home page  (route: /)
// ─────────────────────────────────────────────────────────────
// This file composes the home page layout.
// It imports two components and arranges them on the page.
// You should not need to write styling here — style each
// component in its own CSS module file.
//
// PAGE LAYOUT (top to bottom):
//   <main>
//     <HeroSection />       ← headline, subtitle, stats chips
//     <section>             ← side-by-side cards grid
//       <StepCard step 1 /> ← "Explore the diagram" card
//       <StepCard step 2 /> ← "Test yourself" card
//     </section>
//   </main>
//
// The two StepCards sit in a two-column grid on desktop,
// stacked single-column on mobile.
//
// WHAT TO DO:
//   1. Import HeroSection from '@/components/home/HeroSection'
//   2. Import StepCard from '@/components/home/StepCard'
//   3. Render them inside <main className="page-shell">
//      (page-shell is defined in globals.css — it adds the
//       top padding needed to clear the fixed navbar)
//   4. Create a CSS module (page.module.css) for the grid layout.
// ─────────────────────────────────────────────────────────────

import HeroSection from '@/components/home/HeroSection'
import StepCard from '@/components/home/StepCard'
import styles from './page.module.css'

export default function HomePage() {
  return (
      <main className="page-shell">
          <HeroSection />
          <section className={`${styles.cardGrid} content-area`}>
              <StepCard
                variant="learn"
                illustrationSrc="/illustration-learn.svg"
                illustrationAlt="Explore the diagram"
                title="Explore the diagram"
                description="Tap any component to learn what it does, what it depends on, and how it talks to the rest of the system."
                ctaLabel="Start exploring"
                ctaHref="/diagram"
              />
              <StepCard
                variant="test"
                illustrationSrc="/illustration-test.svg"
                illustrationAlt="Fill in the diagram"
                title="Fill in the diagram"
                description="Drag the pieces into the right layer. Check your work, fix the red bits, and earn a full-green score."
                ctaLabel="Try the exercise"
                ctaHref="/exercise"
              />
          </section>
      </main>
  )
}
