import { useState } from 'react'
import { ThemeContext, ThemeUpdateContext } from './ThemeContext'
import type { ReactNode } from 'react'

const localTheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {

  const [theme, setTheme] = useState<'light' | 'dark'>(localTheme)

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      // update HTML class
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      // persist to localStorage
      localStorage.setItem('theme', nextTheme);
      return nextTheme;
    });
  }

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={toggleTheme}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  )
}