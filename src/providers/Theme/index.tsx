'use client'

import React, { createContext, useCallback, use, useSyncExternalStore } from 'react'

import type { Theme, ThemeContextType } from './types'

import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const themeChangeEvent = 'vrtks-theme-change'

const getPreferredTheme = (): Theme => {
  const preference = window.localStorage.getItem(themeLocalStorageKey)

  if (themeIsValid(preference)) return preference

  return getImplicitPreference() || defaultTheme
}

const getThemeSnapshot = (): Theme => {
  const documentTheme = document.documentElement.getAttribute('data-theme')

  return themeIsValid(documentTheme) ? documentTheme : getPreferredTheme()
}

const getServerThemeSnapshot = (): Theme => defaultTheme

const subscribeToTheme = (onStoreChange: () => void) => {
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')

  const syncPreferredTheme = () => {
    document.documentElement.setAttribute('data-theme', getPreferredTheme())
    onStoreChange()
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === themeLocalStorageKey) syncPreferredTheme()
  }

  const handleColorSchemeChange = () => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)

    if (!themeIsValid(preference)) syncPreferredTheme()
  }

  window.addEventListener(themeChangeEvent, onStoreChange)
  window.addEventListener('storage', handleStorage)
  colorScheme.addEventListener('change', handleColorSchemeChange)

  return () => {
    window.removeEventListener(themeChangeEvent, onStoreChange)
    window.removeEventListener('storage', handleStorage)
    colorScheme.removeEventListener('change', handleColorSchemeChange)
  }
}

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot)

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
      document.documentElement.setAttribute('data-theme', getPreferredTheme())
    } else {
      window.localStorage.setItem(themeLocalStorageKey, themeToSet)
      document.documentElement.setAttribute('data-theme', themeToSet)
    }

    window.dispatchEvent(new Event(themeChangeEvent))
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
