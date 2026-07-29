// app/layout.tsx
// ─────────────────────────────────────────────────────────────
// Root layout — wraps every page on the site.
//
// Responsibilities:
//   1. Load all three CAVE fonts via Next.js font loader.
//      Each font is injected as a CSS variable so globals.css
//      can reference it with var(--font-bricolage) etc.
//   2. Apply global styles (globals.css).
//   3. Render the shared <Navbar /> above every page.
//   4. Set site-wide <meta> title and description.
//
// You should NOT need to edit this file unless adding a new
// Google Font or changing the site title/description.
// ─────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { Bricolage_Grotesque, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import AppErrorBoundary from '@/components/layout/AppErrorBoundary'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage', // used by --font-display in globals.css
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta', // used by --font-sans in globals.css
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains', // used by --font-mono in globals.css
})

const basePath = process.env.NODE_ENV === 'production' ? '/cave-learn' : ''

export const metadata: Metadata = {
  title: 'CAVE Learn',
  description: 'Learn Clean Architecture by playing with it.',
  icons: {
    icon: [{ url: `${basePath}/logo_dark.svg`, type: 'image/svg+xml' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jakarta.variable} ${jetbrains.variable}`}>
      <body>
        <AppErrorBoundary>
          <Navbar />
          {children}
        </AppErrorBoundary>
      </body>
    </html>
  )
}
