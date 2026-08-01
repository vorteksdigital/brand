import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('loads the primary public routes', async ({ page }) => {
    const routes = [
      { path: '/projects', title: 'Projects' },
      { path: '/about', title: 'About' },
      { path: '/contact', title: 'Contact' },
    ]

    for (const route of routes) {
      const response = await page.goto(`http://localhost:3000${route.path}`)

      expect(response?.status()).toBe(200)
      await expect(page).toHaveTitle(`${route.title} | VRTKS Digital`)
      await expect(page.getByRole('heading', { level: 1, name: route.title })).toBeVisible()
      const routeShell = page.locator('[data-route-shell]')
      await expect(routeShell).toHaveCount(1)
      const padding = await routeShell.evaluate((element) => {
        const styles = getComputedStyle(element)

        return {
          bottom: Number.parseFloat(styles.paddingBottom),
          left: Number.parseFloat(styles.paddingLeft),
          right: Number.parseFloat(styles.paddingRight),
          top: Number.parseFloat(styles.paddingTop),
        }
      })

      expect(padding.top).toBe(112)
      expect(padding.bottom).toBe(20)
      expect(padding.left).toBeCloseTo(67.7248, 1)
      expect(padding.right).toBeCloseTo(67.7248, 1)
      const containerLayout = await routeShell.locator('.container').first().evaluate((element) => {
        const containerBounds = element.getBoundingClientRect()
        const route = element.closest<HTMLElement>('[data-route-shell]')

        if (!route) return null

        const routeBounds = route.getBoundingClientRect()
        const routeStyles = getComputedStyle(route)
        const styles = getComputedStyle(element)

        return {
          availableWidth:
            routeBounds.width -
            Number.parseFloat(routeStyles.paddingLeft) -
            Number.parseFloat(routeStyles.paddingRight),
          marginLeft: Number.parseFloat(styles.marginLeft),
          marginRight: Number.parseFloat(styles.marginRight),
          maxWidth: styles.maxWidth,
          width: containerBounds.width,
        }
      })

      expect(containerLayout).not.toBeNull()
      expect(containerLayout?.maxWidth).toBe('none')
      expect(containerLayout?.marginLeft).toBe(0)
      expect(containerLayout?.marginRight).toBe(0)
      expect(containerLayout?.width).toBeCloseTo(containerLayout?.availableWidth || 0, 1)
      const headingGap = await page.getByRole('heading', { level: 1, name: route.title }).evaluate(
        (heading) => {
          const header = document.querySelector('header')

          if (!header) return null

          return heading.getBoundingClientRect().top - header.getBoundingClientRect().bottom
        },
      )

      expect(headingGap).toBe(32)
      await expect(
        page
          .getByRole('navigation', { name: 'Primary navigation' })
          .getByRole('link', { name: route.title.toLowerCase() }),
      ).toHaveAttribute('aria-current', 'page')
    }

    await page.goto('http://localhost:3000')
    await expect(
      page
        .getByRole('navigation', { name: 'Primary navigation' })
        .getByRole('link', { name: 'projects' }),
    ).toHaveAttribute('href', '/projects')

    const sitemap = await page.request.get('http://localhost:3000/pages-sitemap.xml')
    const sitemapText = await sitemap.text()

    expect(sitemap.ok()).toBe(true)
    expect(sitemapText).toContain('/projects</loc>')
    expect(sitemapText).toContain('/about</loc>')
    expect(sitemapText).toContain('/contact</loc>')

    await page.setViewportSize({ height: 667, width: 375 })
    await page.goto('http://localhost:3000/projects')
    await expect(page.locator('[data-route-shell]')).toHaveCSS('padding', '112px 20px 20px')

    await page.setViewportSize({ height: 1080, width: 1920 })
    await page.goto('http://localhost:3000/about')
    await expect(page.locator('[data-route-shell]')).toHaveCSS(
      'padding',
      '112px 96px 20px',
    )
  })

  test('uses Inter across public route groups', async ({ page }) => {
    for (const path of ['/', '/coming-soon']) {
      await page.goto(`http://localhost:3000${path}`)
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)
      const logo = page.getByRole('link', { name: 'VRTKS Digital home' }).first().locator('img')
      await expect(logo).toHaveAttribute('src', '/logo-vrtks.svg')
      await expect
        .poll(() =>
          logo.evaluate((image) => ({
            height: (image as HTMLImageElement).naturalHeight,
            width: (image as HTMLImageElement).naturalWidth,
          })),
        )
        .toEqual({ height: 65, width: 500 })
      await expect(page.locator('link[rel="icon"]')).toHaveCount(1)
      await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg')

      if (path === '/') {
        await expect(page.locator('header p').first()).toHaveCSS('font-family', /Inter/)
        await expect(
          page.locator('button[aria-label="Open menu"] svg.lucide-menu'),
        ).toHaveCount(1)
        await expect(
          page.locator('label[for="header-theme"] > span[aria-hidden="true"] > span'),
        ).toHaveCount(1)
      } else {
        await expect(page.getByRole('link', { name: 'Start a project' }).locator('svg.lucide-arrow-up-right')).toHaveCount(1)
      }
    }

    const favicon = await page.request.get('http://localhost:3000/favicon.svg')
    expect(favicon.ok()).toBe(true)
    expect(favicon.headers()['content-type']).toContain('image/svg+xml')
  })

  test('renders Payload projects in the reference horizontal rail', async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto('http://localhost:3000/projects')

    const gallery = page.getByRole('region', { name: 'Scrollable project gallery' })
    const cycles = gallery.locator('[data-project-cycle]')
    const cards = gallery.locator('[data-project-cycle]:not([aria-hidden]) article')

    await expect(cycles).toHaveCount(3)
    await expect(cards).toHaveCount(6)
    await expect(cards.first().getByRole('heading', { name: /Signal Shift 2026/ })).toBeVisible()
    await expect(gallery).toHaveAttribute('tabindex', '0')
    expect(
      await gallery.evaluate((element) => element.scrollWidth > element.clientWidth),
    ).toBe(true)
    const galleryBounds = await gallery.boundingBox()
    expect(galleryBounds?.x).toBe(0)
    expect(galleryBounds?.width).toBe(1440)
    await expect(page.locator('footer')).toBeHidden()
    expect(
      await page.locator('[data-projects-page]').evaluate((element) => element.clientHeight),
    ).toBe(900)

    await gallery.evaluate((element) => {
      element.scrollLeft = 0
      element.dispatchEvent(new Event('scroll'))
    })
    await expect.poll(() => gallery.evaluate((element) => element.scrollLeft)).toBeGreaterThan(100)

    const firstImage = cards.first().locator('img')
    const imageBounds = await firstImage.boundingBox()
    expect(imageBounds?.width).toBeGreaterThan(380)
    expect(imageBounds ? imageBounds.width / imageBounds.height : 0).toBeCloseTo(0.9, 1)

    await page.setViewportSize({ height: 844, width: 390 })
    await expect(cards.first()).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
  })

  test('renders the reference-led About studio story', async ({ page }) => {
    await page.goto('http://localhost:3000/about')

    await expect(page.getByRole('heading', { name: /Digital for global brands/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Life @ VRTKS' })).toBeVisible()
    await expect(page.locator('section').filter({ hasText: 'Clients' }).locator('li')).toHaveCount(16)
    await expect(page.locator('svg.lucide-arrow-right')).toHaveCount(4)
    const showcase = page.getByRole('region', { name: 'Selected studio work' })
    const track = page.locator('[data-about-showcase-track]')
    const showcaseBounds = await showcase.boundingBox()
    const trackXBefore = await track.evaluate((element) => element.getBoundingClientRect().x)
    expect(showcaseBounds?.x).toBe(0)
    expect(showcaseBounds?.width).toBe(page.viewportSize()?.width)
    await page.evaluate(() => window.scrollBy({ top: 600 }))
    await expect
      .poll(() => track.evaluate((element) => element.getBoundingClientRect().x))
      .toBeLessThan(trackXBefore)
    const clientsHeading = page.getByRole('heading', { name: 'Clients' })
    await clientsHeading.scrollIntoViewIfNeeded()
    await expect(clientsHeading).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
  })

  test('renders the branded reference footer responsively', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.setViewportSize({ height: 1000, width: 1440 })
    await page.goto('http://localhost:3000/about')

    const footer = page.locator('footer')
    const footerNav = page.getByRole('navigation', { name: 'Footer navigation' })
    const footerInner = footer.locator('> div').filter({ has: footerNav })
    const footerLogo = footer.getByRole('link', { name: 'VRTKS Digital home' }).locator('img')
    const resolveSharedBackground = () =>
      page.evaluate(() => {
        const probe = document.createElement('span')
        probe.style.backgroundColor = 'var(--background)'
        document.body.append(probe)
        const background = getComputedStyle(probe).backgroundColor

        probe.remove()
        return background
      })

    await expect(footer).toHaveCSS(
      'background-color',
      await resolveSharedBackground(),
    )
    await expect(footer).toHaveCSS('margin', '0px')
    await expect(footer).toHaveCSS('border-radius', '0px')
    expect(
      await footerInner.evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingLeft)),
    ).toBeCloseTo(1440 * 0.05291, 1)
    await page.setViewportSize({ height: 1000, width: 3000 })
    await expect(footerInner).toHaveCSS('padding-left', '96px')
    await expect(footerInner).toHaveCSS('padding-right', '96px')
    await page.setViewportSize({ height: 1000, width: 1440 })
    await expect(footerNav.getByRole('link')).toHaveCount(5)
    await expect(footerNav.getByRole('link', { name: 'projects' })).toHaveAttribute(
      'href',
      '/projects',
    )
    await expect(footer.getByRole('link', { name: 'info@vorteksdigital.co.za' })).toHaveAttribute(
      'href',
      'mailto:info@vorteksdigital.co.za',
    )
    await expect(footerLogo).toHaveAttribute('src', '/logo-vrtks.svg')
    await expect(footerLogo).toHaveCSS('filter', 'invert(1)')
    await expect
      .poll(() => footerLogo.evaluate((image) => image.getBoundingClientRect().width))
      .toBeGreaterThan(1200)

    await page.locator('label[for="header-theme"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(footer).toHaveCSS(
      'background-color',
      await resolveSharedBackground(),
    )
    await expect(footerLogo).toHaveCSS('filter', 'none')

    await page.setViewportSize({ height: 844, width: 390 })
    await expect(footer).toHaveCSS('min-height', '752px')
    await expect(footer).toHaveCSS('margin', '0px')
    await expect(footer).toHaveCSS('border-radius', '0px')
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      )
      .toBe(true)
    await expect(footerNav).toBeVisible()
    await expect(footerLogo).toBeVisible()
  })

  test('renders the reference-driven 404 in light and dark modes', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.setViewportSize({ height: 900, width: 1440 })
    const response = await page.goto('http://localhost:3000/this-route-does-not-exist')

    expect(response?.status()).toBe(404)
    await expect(page).toHaveTitle('Page Not Found | VRTKS Digital')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)

    const errorPage = page.locator('[data-not-found-page]')
    const code = page.locator('[data-not-found-code]')
    const message = page.getByText('Oops, not sure how you got here.')
    const homeLink = page.getByRole('link', { name: 'Back to home' })
    const readSitePalette = () =>
      errorPage.evaluate((element) => {
        const styles = getComputedStyle(element)

        return {
          background: styles.backgroundColor,
          color: styles.color,
        }
      })
    const resolveThemePalette = () =>
      page.evaluate(() => {
        const probe = document.createElement('span')
        probe.style.backgroundColor = 'var(--background)'
        probe.style.color = 'var(--foreground)'
        probe.style.transition = 'none'
        document.body.append(probe)
        const styles = getComputedStyle(probe)

        const palette = {
          background: styles.backgroundColor,
          color: styles.color,
        }

        probe.remove()
        return palette
      })

    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
    const lightPalette = await readSitePalette()
    await expect(message).toBeVisible()
    await expect(message).toHaveCSS('font-family', /Inter/)
    expect(lightPalette).toEqual(await resolveThemePalette())
    await expect(code).toHaveCSS('font-family', /Times New Roman/)
    expect(
      await code.evaluate((element) => Number.parseFloat(getComputedStyle(element).letterSpacing)),
    ).toBeGreaterThan(0)
    await expect(homeLink).toHaveAttribute('href', '/')
    await expect(homeLink).toHaveCSS('border-top-width', '3px')
    await expect(homeLink).toHaveCSS('border-bottom-width', '3px')
    await expect(page.locator('header')).toBeHidden()
    await expect(page.locator('footer:has(nav[aria-label="Footer navigation"])')).toBeHidden()
    await expect
      .poll(() => code.evaluate((element) => element.getBoundingClientRect().width))
      .toBeGreaterThan(1440)

    await page.evaluate(() => window.localStorage.setItem('payload-theme', 'dark'))
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    const darkPalette = await readSitePalette()
    expect(darkPalette).not.toEqual(lightPalette)
    expect(darkPalette).toEqual(await resolveThemePalette())

    await page.setViewportSize({ height: 844, width: 390 })
    const mobileCodeBounds = await code.boundingBox()
    expect(mobileCodeBounds?.width).toBeGreaterThan(390)
    expect(mobileCodeBounds?.y).toBeGreaterThan(500)
    expect(mobileCodeBounds ? mobileCodeBounds.y + mobileCodeBounds.height : 0).toBeGreaterThan(844)
    expect(mobileCodeBounds ? mobileCodeBounds.y + mobileCodeBounds.height : 0).toBeLessThan(900)
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      )
      .toBe(true)
  })

  test('loads the supplied blogs feed and menu route', async ({ page }) => {
    await page.goto('http://localhost:3000/projects')
    const projectHeadingPresentation = await page
      .getByRole('heading', { level: 1, name: 'Projects' })
      .evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        const styles = getComputedStyle(element)

        return {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
          marginBottom: styles.marginBottom,
          width: bounds.width,
          x: bounds.x,
          y: bounds.y,
        }
      })
    const response = await page.goto('http://localhost:3000/blogs')

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle('Blogs | VRTKS Digital')
    await expect(page.locator('[data-route-shell]')).toHaveCount(1)
    const blogsHeading = page.getByRole('heading', { level: 1, name: 'Blogs' })
    await expect(blogsHeading).toBeVisible()
    await expect(blogsHeading).toHaveAttribute('id', 'blogs-title')
    await expect(page.locator('section[aria-labelledby="blogs-title"]')).toHaveCSS(
      'max-width',
      'none',
    )
    await expect(page.locator('section[aria-labelledby="blogs-title"]')).toHaveCSS(
      'margin-inline',
      '0px',
    )
    const blogsHeadingGap = await blogsHeading.evaluate((heading) => {
      const header = document.querySelector('header')

      if (!header) return null

      return heading.getBoundingClientRect().top - header.getBoundingClientRect().bottom
    })
    expect(blogsHeadingGap).toBe(32)
    await expect(page.locator('section[aria-labelledby="blogs-title"]')).toBeVisible()
    await expect
      .poll(() =>
        blogsHeading.evaluate((element) => {
          const bounds = element.getBoundingClientRect()
          const styles = getComputedStyle(element)

          return {
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            marginBottom: styles.marginBottom,
            width: bounds.width,
            x: bounds.x,
            y: bounds.y,
          }
        }),
      )
      .toEqual(projectHeadingPresentation)
    await expect(page.getByRole('navigation', { name: 'Blog categories' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
    await expect(
      page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', {
        name: 'blogs',
      }),
    ).toHaveAttribute('aria-current', 'page')

    const sitemap = await page.request.get('http://localhost:3000/pages-sitemap.xml')
    expect(await sitemap.text()).toContain('/blogs</loc>')
  })

  test('theme toggle changes the site palette and persists', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('http://localhost:3000')

    const desktopTheme = page.locator('#header-theme')
    const readPalette = (selector: string) =>
      page.locator(selector).first().evaluate((element) => {
        const styles = getComputedStyle(element)

        return {
          background: styles.backgroundColor,
          color: styles.color,
        }
      })
    const resolveThemePalette = () =>
      page.evaluate(() => {
        const probe = document.createElement('span')
        probe.style.backgroundColor = 'var(--background)'
        probe.style.color = 'var(--foreground)'
        probe.style.transition = 'none'
        document.body.append(probe)

        const styles = getComputedStyle(probe)
        const palette = {
          background: styles.backgroundColor,
          color: styles.color,
        }

        probe.remove()
        return palette
      })

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await expect(desktopTheme).not.toBeChecked()
    const desktopThemeLabel = page.locator('label[for="header-theme"]')
    const desktopThemeTrack = desktopThemeLabel.locator('span[aria-hidden="true"]').first()
    await expect(desktopThemeLabel.locator('> span[aria-hidden="true"] > span')).toHaveCount(1)
    await expect(page.locator('header')).toHaveCSS('mix-blend-mode', 'difference')
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toHaveCSS(
      'mix-blend-mode',
      'normal',
    )
    await expect(desktopThemeLabel).toHaveCSS('mix-blend-mode', 'normal')
    expect(await desktopThemeLabel.evaluate((element) => element.closest('header') === null)).toBe(
      true,
    )
    const themeToggleSlot = page.locator('[data-theme-toggle-slot]')
    const readToggleAlignment = () =>
      page.evaluate(() => {
        const slot = document.querySelector<HTMLElement>('[data-theme-toggle-slot]')
        const toggle = document.querySelector<HTMLElement>('label[for="header-theme"]')

        if (!slot || !toggle) return null

        const slotBounds = slot.getBoundingClientRect()
        const toggleBounds = toggle.getBoundingClientRect()

        return {
          height: Math.abs(slotBounds.height - toggleBounds.height),
          width: Math.abs(slotBounds.width - toggleBounds.width),
          x: Math.abs(slotBounds.x - toggleBounds.x),
          y: Math.abs(slotBounds.y - toggleBounds.y),
        }
      })

    await expect(themeToggleSlot).toBeVisible()
    await expect.poll(readToggleAlignment).toEqual({ height: 0, width: 0, x: 0, y: 0 })
    const compactToggleBounds = await desktopThemeLabel.boundingBox()
    expect(compactToggleBounds?.width).toBeCloseTo(41.65, 1)
    expect(compactToggleBounds?.height).toBeCloseTo(23.8, 1)
    await page.setViewportSize({ height: 720, width: 1100 })
    await expect.poll(readToggleAlignment).toEqual({ height: 0, width: 0, x: 0, y: 0 })
    const toggleYBeforeAdmin = await desktopThemeLabel.evaluate(
      (element) => element.getBoundingClientRect().y,
    )
    await page.evaluate(() =>
      document.documentElement.style.setProperty('--admin-bar-height', '37px'),
    )
    await expect.poll(readToggleAlignment).toEqual({ height: 0, width: 0, x: 0, y: 0 })
    await expect
      .poll(() => desktopThemeLabel.evaluate((element) => element.getBoundingClientRect().y))
      .toBe(toggleYBeforeAdmin + 37)
    await page.evaluate(() => document.documentElement.style.removeProperty('--admin-bar-height'))
    await expect.poll(readToggleAlignment).toEqual({ height: 0, width: 0, x: 0, y: 0 })
    await expect(desktopThemeTrack).toHaveCSS('background-color', 'rgb(84, 148, 222)')
    const lightPalette = await resolveThemePalette()
    await expect.poll(() => readPalette('main section')).toEqual(lightPalette)

    await page.locator('label[for="header-theme"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(desktopTheme).toBeChecked()
    await expect(desktopThemeTrack).toHaveCSS('background-color', 'rgb(32, 38, 44)')
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('payload-theme')))
      .toBe('dark')
    const darkPalette = await resolveThemePalette()

    expect(darkPalette).not.toEqual(lightPalette)
    await expect.poll(() => readPalette('main section')).toEqual(darkPalette)

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.locator('#header-theme')).toBeChecked()

    await page.goto('http://localhost:3000/about')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect.poll(() => readPalette('body')).toEqual(darkPalette)

    await page.locator('label[for="header-theme"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await expect.poll(() => readPalette('body')).toEqual(lightPalette)
  })

  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/VRTKS Digital/)
    await expect(page.locator('.admin-bar')).toBeHidden()
    const heading = page.locator('h1').first()
    await expect(heading).toHaveAccessibleName("Shaping Tomorrow's brand Today")

    const headerBox = await page.locator('header').boundingBox()
    const mainBox = await page.locator('main').boundingBox()
    expect(headerBox?.y).toBe(0)
    expect(mainBox?.y).toBe(0)
  })

  test('mobile header menu manages focus, scrolling, and theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto('http://localhost:3000')

    const menuButton = page.getByRole('button', { name: 'Open menu' })
    await menuButton.click()

    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    const drawer = page.getByRole('dialog', { name: 'Mobile navigation' })
    await expect(drawer).toBeVisible()
    const closeButton = page.getByRole('button', { name: 'Close menu', exact: true }).last()
    await expect(closeButton).toBeFocused()
    await expect(closeButton.locator('svg.lucide-x')).toHaveCount(1)
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
    const lightDrawerBackground = await drawer.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    )

    await page.keyboard.press('Shift+Tab')
    await expect(page.locator('#mobile-header-theme')).toBeFocused()
    const toggleTrack = page
      .locator('label[for="mobile-header-theme"] > span[aria-hidden="true"]')
      .first()
    await expect.poll(() => toggleTrack.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('solid')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Close menu', exact: true }).last()).toBeFocused()

    await page.locator('label[for="mobile-header-theme"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect
      .poll(() => drawer.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe(lightDrawerBackground)
    await expect.poll(() => toggleTrack.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('none')

    await page.keyboard.press('Escape')
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await expect(menuButton).toBeFocused()
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
  })

  test('mobile menu closes when the viewport becomes desktop-sized', async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto('http://localhost:3000')

    const menuButton = page.getByRole('button', { name: 'Open menu' })
    await menuButton.click()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    await page.setViewportSize({ height: 844, width: 1100 })

    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
  })
})
