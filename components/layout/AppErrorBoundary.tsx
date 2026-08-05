'use client'

import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import styles from './AppErrorFallback.module.css'

const ISSUES_URL = 'https://github.com/CA-Visualizer-for-Education/cave-learn/issues'

function AppErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <main className={styles.shell} role="alert" aria-live="assertive">
      <section className={styles.card}>
        <header className={styles.header}>
          <div className={styles.icon} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3l-8.47-14.14a2 2 0 0 0-3.42 0Z" />
            </svg>
          </div>

          <div className={styles.titleWrap}>
            <p className={styles.eyebrow}>CAVE Runtime Guard</p>
            <h1 className={styles.title}>Something crashed while rendering</h1>
          </div>
        </header>

        <div className={styles.body}>
          <p className={styles.message}>
            This view could not finish loading. You can try again now, or open the Issues page and report what happened.
          </p>

          {process.env.NODE_ENV !== 'production' && (
            <details className={styles.errorDetail}>
              <summary>Technical details</summary>
              {/* react-error-boundary types the caught value as unknown, so narrow before reading .message */}
              <pre className={styles.errorText}>{error instanceof Error ? error.message : String(error)}</pre>
            </details>
          )}

          <div className={styles.actions}>
            <button className="btn btn--primary" onClick={resetErrorBoundary}>
              Try Again
            </button>

            <a className={styles.issuesLink} href={ISSUES_URL} target="_blank" rel="noreferrer">
              View Issues
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary FallbackComponent={AppErrorFallback}>{children}</ErrorBoundary>
}