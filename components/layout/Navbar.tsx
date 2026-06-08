'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

export const NAV_BAR_HEIGHT = 64

const NAV_ITEMS = [
  { href: '/', label: 'Home', exact: true as const },
  { href: '/diagram', label: 'Diagram', matchDiagram: true as const },
  { href: '/exercise', label: 'Test Yourself' },
] as const

function isNavItemActive(
  href: string,
  exact: boolean | undefined,
  matchDiagram: boolean | undefined,
  pathname: string,
): boolean {
  if (exact) {
    return pathname === href
  }

  if (matchDiagram) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      <Link href="/" className={styles.logo} aria-label="Home">
        <Image
          src="/logo_dark.svg"
          alt=""
          width={36}
          height={36}
          className={styles.logoImage}
          priority
        />
        <span className={styles.logoText}>CAVE</span>
        <span className={`badge badge--pink ${styles.learnBadge}`}>LEARN</span>
      </Link>

      <div className={styles.links}>
        {NAV_ITEMS.map(({ href, label, ...item }) => {
          const isActive = isNavItemActive(
            href,
            'exact' in item ? item.exact : false,
            'matchDiagram' in item ? item.matchDiagram : false,
            pathname,
          )

          return (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
