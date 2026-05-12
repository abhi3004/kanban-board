import { useMemo, useState, type PropsWithChildren } from 'react'
import { ThemeContext, type ThemeMode } from './themeContext'

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeMode>('dark')

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
