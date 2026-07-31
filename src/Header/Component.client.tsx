'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import type { Header } from '@/payload-types'
import { useTheme } from '@/providers/Theme'

import {
  defaultHeaderNavItems,
  getLocationAndTime,
  getNavHref,
  isActiveRoute,
} from './utilities'
import styles from './header.module.css'

interface HeaderClientProps {
  data: Header
}

type NavItem = NonNullable<Header['navItems']>[number]

type HeaderLinkProps = {
  className: string
  item: NavItem
  onNavigate?: () => void
  pathname: string
}

const HeaderLink = ({ className, item, onNavigate, pathname }: HeaderLinkProps) => {
  const href = getNavHref(item.link)
  const label = item.link.label

  if (!href || !label) return null

  return (
    <Link
      aria-current={isActiveRoute(pathname, href) ? 'page' : undefined}
      className={className}
      href={href}
      onClick={onNavigate}
      {...(item.link.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
    >
      {label}
    </Link>
  )
}

const ThemeToggle = ({ id }: { id: string }) => {
  const { setTheme, theme } = useTheme()

  return (
    <label className={styles.themeToggle} htmlFor={id}>
      <span className="sr-only">Use dark theme</span>
      <input
        checked={theme === 'dark'}
        id={id}
        onChange={(event) => setTheme(event.target.checked ? 'dark' : 'light')}
        type="checkbox"
      />
      <span aria-hidden="true" className={styles.themeTrack}>
        <span className={styles.themeThumb} />
      </span>
    </label>
  )
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const pathname = usePathname()
  const [locationTime, setLocationTime] = useState(() => getLocationAndTime())
  const [menuOpen, setMenuOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const focusTimerRef = useRef<number | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const configuredNavItems = data.navItems?.filter(
    (item) => Boolean(item.link.label) && Boolean(getNavHref(item.link)),
  )
  const navItems = configuredNavItems?.length ? configuredNavItems : defaultHeaderNavItems

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLocationTime(getLocationAndTime())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const desktopViewport = window.matchMedia('(min-width: 48rem)')
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }

    desktopViewport.addEventListener('change', closeAtDesktop)

    return () => desktopViewport.removeEventListener('change', closeAtDesktop)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    const menuButton = menuButtonRef.current

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        return
      }

      if (event.key !== 'Tab' || !drawerRef.current) return

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled])',
        ),
      )

      const first = focusable[0]
      const last = focusable.at(-1)

      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      menuButton?.focus()
    }
  }, [menuOpen])

  const closeMenu = () => {
    if (focusTimerRef.current !== null) window.clearTimeout(focusTimerRef.current)
    focusTimerRef.current = null
    setMenuOpen(false)
  }
  const openMenu = () => {
    setMenuOpen(true)
    focusTimerRef.current = window.setTimeout(() => {
      focusTimerRef.current = null
      if (drawerRef.current?.getAttribute('aria-hidden') === 'false') {
        closeButtonRef.current?.focus()
      }
    }, 100)
  }

  return (
    <header className={styles.header} data-menu-open={menuOpen}>
      <div className={styles.topBar}>
        <div className={styles.leftGroup}>
          <Link
            aria-label="VRTKS Digital home"
            className={styles.wordmark}
            href="/"
            onClick={closeMenu}
          >
            <span className={styles.wordmarkText}>VRTKS</span>
          </Link>

          <p className={styles.location} suppressHydrationWarning>
            {locationTime}
          </p>
        </div>

        <div className={styles.rightGroup}>
          <nav aria-label="Primary navigation" className={styles.desktopNav}>
            {navItems.map((item, index) => (
              <React.Fragment key={item.id ?? `${item.link.label}-${index}`}>
                <HeaderLink
                  className={styles.desktopLink}
                  item={item}
                  pathname={pathname}
                />
                {index < navItems.length - 1 && <span aria-hidden="true">, </span>}
              </React.Fragment>
            ))}
          </nav>

          <div className={styles.desktopTheme}>
            <ThemeToggle id="header-theme" />
          </div>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label="Open menu"
            className={styles.menuToggle}
            onClick={openMenu}
            ref={menuButtonRef}
            type="button"
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <button
        aria-label="Close menu"
        className={styles.backdrop}
        disabled={!menuOpen}
        onClick={closeMenu}
        tabIndex={menuOpen ? 0 : -1}
        type="button"
      />

      <div
        aria-hidden={!menuOpen}
        aria-label="Mobile navigation"
        aria-modal="true"
        className={styles.drawer}
        id="mobile-navigation"
        inert={!menuOpen}
        ref={drawerRef}
        role="dialog"
      >
        <div className={styles.drawerHeader}>
          <button
            aria-label="Close menu"
            className={styles.closeButton}
            onClick={closeMenu}
            ref={closeButtonRef}
            type="button"
          >
            Close
          </button>
        </div>

        <nav aria-label="Mobile primary navigation" className={styles.mobileNav}>
          {navItems.map((item, index) => (
            <HeaderLink
              className={styles.mobileLink}
              item={item}
              key={item.id ?? `${item.link.label}-${index}`}
              onNavigate={closeMenu}
              pathname={pathname}
            />
          ))}
          <div className={styles.mobileTheme}>
            <ThemeToggle id="mobile-header-theme" />
          </div>
        </nav>
      </div>
    </header>
  )
}
