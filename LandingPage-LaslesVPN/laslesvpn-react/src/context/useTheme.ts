import { useContext } from 'react'
import { ThemeContext, ThemeUpdateContext } from './ThemeContext'

export const useTheme = () => useContext(ThemeContext)
export const useToggleTheme = () => useContext(ThemeUpdateContext)