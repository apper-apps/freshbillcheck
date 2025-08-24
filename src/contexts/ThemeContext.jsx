import React, { createContext, useContext, useEffect, useState } from "react";
import Error from "@/components/ui/Error";

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
const [theme, setTheme] = useState(() => {
    let initialTheme = 'light'
    
    try {
      // Check localStorage first
      const savedTheme = localStorage.getItem('billcheck-theme')
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        initialTheme = savedTheme
      } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          initialTheme = 'dark'
        }
      }
    } catch (error) {
      console.warn('Failed to read theme preference:', error)
    }
    
    // Apply theme immediately to prevent flash
    const root = document.documentElement
    if (initialTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    return initialTheme
  })

  useEffect(() => {
    try {
      // Save to localStorage
      localStorage.setItem('billcheck-theme', theme)
      
      // Apply theme class to document
      const root = document.documentElement
      if (theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    } catch (error) {
      console.warn('Failed to save theme preference:', error)
    }
  }, [theme])

useEffect(() => {
    try {
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => {
        // Only update if user hasn't manually set a theme
        try {
          const savedTheme = localStorage.getItem('billcheck-theme')
          if (!savedTheme) {
            setTheme(e.matches ? 'dark' : 'light')
          }
        } catch (error) {
          console.warn('Failed to check saved theme:', error)
        }
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } catch (error) {
      console.warn('Failed to setup theme media query listener:', error)
    }
  }, [])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext