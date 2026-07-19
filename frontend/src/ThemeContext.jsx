import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'xanvoraa-theme'
const ThemeContext = createContext(null)

function preferredTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Continue with the operating-system preference when storage is unavailable.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(preferredTheme)
  const [publicThemeEnabled, setPublicThemeEnabled] = useState(
    () => !window.location.pathname.startsWith('/admin'),
  )

  useLayoutEffect(() => {
    const effectiveTheme = publicThemeEnabled ? theme : 'dark'
    const root = document.documentElement
    root.classList.remove('light-mode', 'dark-mode')
    root.classList.add(`${effectiveTheme}-mode`)
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