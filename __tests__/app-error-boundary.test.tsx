import { render, screen } from '@testing-library/react'
import AppErrorBoundary from '@/components/layout/AppErrorBoundary'

function HealthyChild() {
  return <div>Healthy content</div>
}

function CrashingChild() {
  throw new Error('render failure for test')
}

describe('AppErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    // React logs boundary-caught errors to console during tests.
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders children normally when no error occurs', () => {
    render(
      <AppErrorBoundary>
        <HealthyChild />
      </AppErrorBoundary>
    )

    expect(screen.getByText('Healthy content')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /something crashed while rendering/i })).not.toBeInTheDocument()
  })

  it('mounts fallback UI when a child throws during render', () => {
    render(
      <AppErrorBoundary>
        <CrashingChild />
      </AppErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /something crashed while rendering/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('shows a link to the GitHub issues page in fallback state', () => {
    render(
      <AppErrorBoundary>
        <CrashingChild />
      </AppErrorBoundary>
    )

    const issuesLink = screen.getByRole('link', { name: /view issues/i })
    expect(issuesLink).toBeInTheDocument()
    expect(issuesLink).toHaveAttribute('href', 'https://github.com/CA-Visualizer-for-Education/cave-learn/issues')
  })
})
