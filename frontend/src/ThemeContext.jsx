import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'xanvoraa-theme'
const ThemeContext = createContext(null)

/**
 * Read the theme that the blocking inline script in index.html already
 * applied to <html>.  This avoids a remove-then-add class cycle that
 * would cause a flash of unstyled content (FOUC).
 */
function readAppliedTheme() {
  const root = document.documentElement
  if (root.classList.contains('light-mode')) return 'light'
  if (root.classList.contains('dark-mode')) return 'dark'

  // Fallback: derive from localStorage / OS preference (same logic as the
  // inline script) and apply immediately so the rest of the app stays in sync.
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Continue with the operating-system preference when storage is unavailable.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  // Seed React state from whatever the blocking <script> already painted.
  const [theme, setTheme] = useState(readAppliedTheme)
  const [publicThemeEnabled, setPublicThemeEnabled] = useState(
    () => !window.location.pathname.startsWith('/admin'),
  )

  // Track the class that is currently on <html> so we only touch the DOM
  // when the effective theme genuinely changes.
  const appliedRef = useRef(
    document.documentElement.classList.contains('light-mode') ? 'light-mode' : 'dark-mode',
  )

  useLayoutEffect(() => {
    const effectiveTheme = publicThemeEnabled ? theme : 'dark'
    const nextClass = `${effectiveTheme}-mode`

    // Skip the DOM write entirely when the class is already correct.
    // This is the key change that prevents the FOUC: on first mount the
    // class set by the inline script matches, so we never remove it.
    if (appliedRef.current === nextClass) return

    const root = document.documentElement
    root.classList.remove(appliedRef.current)
    root.classList.add(nextClass)
    appliedRef.current = nextClass
  }, [publicThemeEnabled, theme])

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // The theme still works for this session when storage is unavailable.
      }
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ theme, toggleTheme, setPublicThemeEnabled }),
    [theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside ThemeProvider')
  return value
}