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
      await expect(
        page
          .getByRole('navigation', { name: 'Primary navigation' })
          .getByRole('link', { name: route.title.toLowerCase() }),
      ).toHaveAttribute('aria-current', 'page')
    }

    await page.goto('http://localhost:3000')
    await expect(page.getByRole('link', { name: 'projects' })).toHaveAttribute('href', '/projects')

    const sitemap = await page.request.get('http://localhost:3000/pages-sitemap.xml')
    const sitemapText = await sitemap.text()

    expect(sitemap.ok()).toBe(true)
    expect(sitemapText).toContain('/projects</loc>')
    expect(sitemapText).toContain('/about</loc>')
    expect(sitemapText).toContain('/contact</loc>')
  })

  test('uses Inter across public route groups', async ({ page }) => {
    for (const path of ['/', '/coming-soon']) {
      await page.goto(`http://localhost:3000${path}`)
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)

      if (path === '/') {
        await expect(page.locator('header p').first()).toHaveCSS('font-family', /Inter/)
      }
    }
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
    const blogsHeading = page.getByRole('heading', { level: 1, name: 'Blogs' })
    await expect(blogsHeading).toBeVisible()
    await expect(blogsHeading).toHaveAttribute('id', 'blogs-title')
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
    const lightPalette = await resolveThemePalette()
    await expect.poll(() => readPalette('main section')).toEqual(lightPalette)

    await page.locator('label[for="header-theme"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(desktopTheme).toBeChecked()
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
    await expect(page.getByRole('button', { name: 'Close menu', exact: true }).last()).toBeFocused()
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
    const lightDrawerBackground = await drawer.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    )

    await page.keyboard.press('Shift+Tab')
    await expect(page.locator('#mobile-header-theme')).toBeFocused()
    const toggleTrack = page.locator('label[for="mobile-header-theme"] > span[aria-hidden="true"]')
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
