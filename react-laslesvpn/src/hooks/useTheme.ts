import { useContext } from 'react'
import { ThemeContext, ThemeUpdateContext } from '../context/ThemeContext'

export const useTheme = () => useContext(ThemeContext)
export const useToggleTheme = () => useContext(ThemeUpdateContext)