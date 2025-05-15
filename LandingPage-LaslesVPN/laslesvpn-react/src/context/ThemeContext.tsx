import { createContext } from 'react'

export const ThemeContext = createContext<'light' | 'dark'>('light')
export const ThemeUpdateContext = createContext<() => void>(() => { })