import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('loads the primary public routes', async ({ page }) => {
    const routes = [
      {
        heading: 'Projects',
        nav: 'projects',
        path: '/projects',
        title: 'Digital Portfolio | Vorteks Digital',
      },
      {
        heading: /Digital support for growing businesses/i,
        nav: 'about',
        path: '/about',
        title: 'About Vorteks Digital | Global Digital Studio',
      },
      {
        heading: /Digital support, built around your business/i,
        nav: 'services',
        path: '/approach',
        title: 'Digital Services for Startups | Vorteks Digital',
      },
      {
        heading: /Start a project\. Build what matters/i,
        nav: 'contact',
        path: '/contact',
        title: 'Start a Project | Contact Vorteks Digital',
      },
    ]

    for (const route of routes) {
      const response = await page.goto(`http://localhost:3000${route.path}`)

      expect(response?.status()).toBe(200)
      await expect(page).toHaveTitle(route.title)
      const routeHeading = page.getByRole('heading', { level: 1, name: route.heading })
      if (route.path === '/projects') {
        await expect(routeHeading).toHaveClass(/sr-only/)
      } else {
        await expect(routeHeading).toBeVisible()
      }
      await expect(
        page
          .getByRole('navigation', { name: 'Primary navigation' })
          .getByRole('link', { name: route.nav }),
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
    expect(sitemapText).toContain('/approach</loc>')
    expect(sitemapText).toContain('/about</loc>')
    expect(sitemapText).toContain('/contact</loc>')

    await page.setViewportSize({ height: 667, width: 375 })
    await page.goto('http://localhost:3000/projects')
    await expect(page.locator('[data-route-shell]')).toHaveCSS('padding', '112px 20px 20px')

    await page.setViewportSize({ height: 1080, width: 1920 })
    await page.goto('http://localhost:3000/projects')
    await expect(page.locator('[data-route-shell]')).toHaveCSS('padding', '112px 96px 20px')
  })

  test('uses 120px body-section spacing with a 40px About slider', async ({ page, request }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })

    const postsResponse = await request.get('/api/posts?depth=0&limit=1')
    const postsData = (await postsResponse.json()) as { docs?: Array<{ slug?: string }> }
    const postSlug = postsData.docs?.[0]?.slug
    const routes = [
      { hero: '[aria-labelledby="home-hero-title"]', path: '/' },
      { hero: '[data-approach-page] > section:first-of-type', path: '/approach' },
      { hero: '[data-about-page] > section:first-of-type', path: '/about' },
      { hero: '[data-low-impact-hero]', path: '/blogs' },
      { hero: '[data-contact-page] > section:first-of-type', path: '/contact' },
      { path: '/posts' },
      { path: '/search' },
      ...(postSlug ? [{ hero: 'article > header', path: `/posts/${postSlug}` }] : []),
    ]

    for (const viewport of [
      { height: 900, width: 1440 },
      { height: 1024, width: 768 },
      { height: 844, width: 390 },
    ]) {
      await page.setViewportSize(viewport)

      for (const route of routes) {
        await page.goto(`http://localhost:3000${route.path}`)

        const sections = page.locator('.content-section')
        await expect(sections).not.toHaveCount(0)
        const spacing = await sections.evaluateAll((elements) =>
          elements.map((element) => {
            const styles = getComputedStyle(element)

            return {
              isAboutSlider: element.classList.contains('content-section--about-slider'),
              marginBottom: Number.parseFloat(styles.marginBottom),
              marginTop: Number.parseFloat(styles.marginTop),
              paddingBottom: Number.parseFloat(styles.paddingBottom),
              paddingTop: Number.parseFloat(styles.paddingTop),
            }
          }),
        )

        expect(
          spacing.every(
            ({ isAboutSlider, paddingBottom }) => paddingBottom === (isAboutSlider ? 40 : 120),
          ),
        ).toBe(true)
        expect(
          spacing.every(
            ({ isAboutSlider, paddingTop }) => paddingTop === (isAboutSlider ? 40 : 120),
          ),
        ).toBe(true)
        expect(spacing.every(({ marginBottom }) => marginBottom === 0)).toBe(true)
        expect(spacing.every(({ marginTop }) => marginTop === 0)).toBe(true)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        )

        if (route.hero) {
          const hero = page.locator(route.hero).first()
          await expect(hero).toHaveCount(1)
          await expect(hero).not.toHaveClass(/content-section/)
        }
      }
    }
  })

  test('uses Inter across public route groups', async ({ page }) => {
    for (const path of ['/', '/coming-soon']) {
      await page.goto(`http://localhost:3000${path}`)
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)
      const logo = page.getByRole('link', { name: 'Vorteks Digital home' }).first().locator('img')
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
        await expect(page.locator('button[aria-label="Open menu"] svg.lucide-menu')).toHaveCount(1)
        await expect(
          page.locator('label[for="header-theme"] > span[aria-hidden="true"] > span'),
        ).toHaveCount(1)
      } else {
        await expect(
          page.getByRole('link', { name: 'Start a project' }).locator('svg.lucide-arrow-up-right'),
        ).toHaveCount(1)
      }
    }

    const favicon = await page.request.get('http://localhost:3000/favicon.svg')
    expect(favicon.ok()).toBe(true)
    expect(favicon.headers()['content-type']).toContain('image/svg+xml')
  })

  test('renders published projects in the public portfolio', async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto('http://localhost:3000/projects')

    const projectSection = page.getByRole('region', { name: 'Selected projects' })
    const gallery = page.getByRole('region', { name: 'Scrollable project gallery' })
    await expect(gallery).toBeVisible()
    await expect(gallery.locator('.swiper-slide')).toHaveCount(6)
    await expect(gallery.locator('article')).toHaveCount(6)
    await expect(gallery.getByRole('heading', { name: /Signal Shift 2026/ }).first()).toBeVisible()
    await expect(projectSection).not.toHaveClass(/content-section/)
    await expect(projectSection).toHaveCSS('padding-top', '0px')
    await expect(projectSection).toHaveCSS('padding-bottom', '60px')
    await expect(page.locator('[data-low-impact-hero]')).toHaveCount(0)
    await expect(page.locator('footer')).toBeHidden()

    await page.setViewportSize({ height: 844, width: 390 })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
  })

  test('renders the reference-led About studio story', async ({ page }) => {
    await page.goto('http://localhost:3000/about')

    await expect(
      page.getByRole('heading', { name: /Digital support for growing businesses/i }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'High-quality work, direct collaboration and less agency overhead.',
      }),
    ).toHaveCSS('font-size', '30px')
    await expect(page.getByRole('heading', { name: 'How we work' })).toBeVisible()
    await expect(
      page.locator('section').filter({ hasText: 'Capabilities' }).locator('li'),
    ).toHaveCount(16)
    await expect(page.locator('svg.lucide-arrow-right')).toHaveCount(4)
    const showcase = page.getByRole('region', { name: 'Selected studio work' })
    const firstShowcaseSlide = page.locator('[data-about-showcase-slide]').first()
    const showcaseBounds = await showcase.boundingBox()
    const slideXBefore = await firstShowcaseSlide.evaluate(
      (element) => element.getBoundingClientRect().x,
    )
    expect(showcaseBounds?.x).toBe(0)
    expect(showcaseBounds?.width).toBe(page.viewportSize()?.width)
    await expect
      .poll(() => firstShowcaseSlide.evaluate((element) => element.getBoundingClientRect().x))
      .toBeLessThan(slideXBefore)
    await page.evaluate(() => window.scrollBy({ top: 600 }))
    const clientsHeading = page.getByRole('heading', { name: 'Capabilities' })
    await clientsHeading.scrollIntoViewIfNeeded()
    await expect(clientsHeading).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
  })

  test('matches the measured About geometry at reference breakpoints', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })

    const readGeometry = () =>
      page.evaluate(() => {
        const pageElement = document.querySelector<HTMLElement>('[data-about-page]')
        const sections = pageElement?.querySelectorAll<HTMLElement>(':scope > section')
        const hero = sections?.[0]
        const showcase = sections?.[1]
        const firstSlide = document.querySelector<HTMLElement>('[data-about-showcase-slide]')
        const title = hero?.querySelector('h1')
        if (!pageElement || !hero || !showcase || !firstSlide || !title) return null
        const unitProbe = document.createElement('span')
        unitProbe.style.cssText =
          'position:absolute;display:block;width:var(--about-unit);height:0;pointer-events:none'
        pageElement.append(unitProbe)
        const unit = unitProbe.getBoundingClientRect().width
        unitProbe.remove()

        return {
          gutter: Number.parseFloat(getComputedStyle(hero).paddingLeft),
          heroHeight: hero.getBoundingClientRect().height,
          slideRatio:
            firstSlide.getBoundingClientRect().width / firstSlide.getBoundingClientRect().height,
          slideWidth: firstSlide.getBoundingClientRect().width,
          titleSize: Number.parseFloat(getComputedStyle(title).fontSize),
          titleWeight: getComputedStyle(title).fontWeight,
          unit,
        }
      })

    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto('http://localhost:3000/about')
    await expect.poll(readGeometry).toMatchObject({
      gutter: expect.closeTo(55.68, 1),
      heroHeight: expect.closeTo(900, 1),
      slideRatio: expect.closeTo(5 / 3, 2),
      slideWidth: expect.closeTo(792, 1),
      titleSize: expect.closeTo(100, 1),
      titleWeight: '800',
      unit: expect.closeTo(9.6, 1),
    })

    await page.setViewportSize({ height: 1024, width: 768 })
    await expect.poll(readGeometry).toMatchObject({
      gutter: expect.closeTo(29.696, 1),
      heroHeight: expect.closeTo(512, 1),
      slideWidth: expect.closeTo(422.4, 1),
      titleSize: expect.closeTo(53.33, 1),
      titleWeight: '800',
      unit: expect.closeTo(5.12, 1),
    })

    await page.setViewportSize({ height: 844, width: 390 })
    await expect.poll(readGeometry).toMatchObject({
      gutter: expect.closeTo(23, 1),
      heroHeight: expect.closeTo(487.7, 1),
      slideWidth: expect.closeTo(351, 1),
      titleSize: expect.closeTo(37.2, 1),
      titleWeight: '800',
      unit: expect.closeTo(10, 1),
    })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
  })

  test('matches the Approach and Contact reference routes', async ({ context, page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })

    const readHero = () =>
      page
        .locator('[data-reference-route] > section')
        .first()
        .evaluate((hero) => {
          const heading = hero.querySelector('h1')
          if (!heading) return null

          return {
            headingSize: Number.parseFloat(getComputedStyle(heading).fontSize),
            headingWeight: getComputedStyle(heading).fontWeight,
            headingY: heading.getBoundingClientRect().y,
            height: hero.getBoundingClientRect().height,
            overflow: document.documentElement.scrollWidth > window.innerWidth,
          }
        })

    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto('http://localhost:3000/approach')
    await expect(page.locator('[data-approach-page]')).toHaveAttribute(
      'data-route-motion',
      'reduced',
    )
    await expect.poll(readHero).toEqual({
      headingSize: expect.closeTo(100, 1),
      headingWeight: '800',
      headingY: 120,
      height: 900,
      overflow: false,
    })
    await expect(page.locator('[data-hero-image-reveal]')).toBeVisible()
    await expect(page.locator('[data-hero-image-reveal] img')).toHaveAttribute(
      'src',
      /johannesburg-mural-portrait\.webp/,
    )
    await expect(page.getByRole('heading', { name: 'What we can help with' })).toBeVisible()
    await expect(
      page.getByRole('heading', {
        name: 'Websites, digital products and bespoke solutions for startups worldwide.',
      }),
    ).toHaveCSS('font-size', '30px')
    await expect(page.getByRole('heading', { name: 'Understand the need' })).toBeVisible()
    await page.getByRole('button', { name: 'Next principle' }).click()
    await expect(page.getByRole('heading', { name: 'Shape and build' })).toBeVisible()

    await page.goto('http://localhost:3000/contact')
    await expect(page.locator('[data-contact-page]')).toHaveAttribute(
      'data-route-motion',
      'reduced',
    )
    await expect.poll(readHero).toEqual({
      headingSize: expect.closeTo(100, 1),
      headingWeight: '800',
      headingY: 120,
      height: 900,
      overflow: false,
    })
    await expect(page.locator('[data-hero-image-reveal]')).toBeVisible()
    await expect(page.locator('[data-hero-image-reveal] img')).toHaveAttribute(
      'src',
      /simmonds-street-johannesburg\.webp/,
    )
    await expect(
      page.getByRole('heading', {
        name: "Tell us what you need. We'll help shape the right digital solution.",
      }),
    ).toHaveCSS('font-size', '30px')
    await expect(page.getByText('(Careers)')).toHaveCount(0)
    await expect(page.locator('form')).toHaveCount(0)
    await expect(page.getByText('Vorteks Digital', { exact: true })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Selected case studies' })).toBeVisible()
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: 'http://localhost:3000',
    })
    await page.getByRole('button', { name: 'Copy' }).click()
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()

    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto('http://localhost:3000/approach')
    await expect(
      page.getByRole('heading', {
        name: 'Websites, digital products and bespoke solutions for startups worldwide.',
      }),
    ).toHaveCSS('font-size', '30px')
    await expect.poll(readHero).toMatchObject({
      headingSize: expect.closeTo(37.2, 1),
      headingWeight: '800',
      headingY: expect.closeTo(300, 1),
      height: expect.any(Number),
      overflow: false,
    })
    await page.goto('http://localhost:3000/contact')
    await expect.poll(readHero).toMatchObject({
      headingSize: expect.closeTo(37.2, 1),
      headingWeight: '800',
      headingY: expect.closeTo(300, 1),
      height: expect.any(Number),
      overflow: false,
    })
  })

  test('animates the reference routes after client navigation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('http://localhost:3000/about')
    await page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'services' })
      .click()

    const route = page.locator('[data-approach-page]')
    await expect(route).toHaveAttribute('data-route-motion', 'running')
    await expect(route).toHaveAttribute('data-route-motion', 'complete', { timeout: 4000 })
  })

  test('stacks pages with the measured Vucko route transition', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto('http://localhost:3000/about')

    const transition = page.locator('[data-page-transition]')
    const blocker = page.locator('[data-page-transition-blocker]')
    await page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'services' })
      .click()

    await expect(blocker).toHaveAttribute('data-active', 'true')
    await expect(transition).toHaveAttribute('data-page-transition-state', 'running')
    await expect(page.locator('[data-page-transition-frame]')).toHaveCount(2)
    await page.waitForTimeout(500)

    const stack = await page.evaluate(() => {
      const outgoing = document.querySelector<HTMLElement>('[data-page-transition-outgoing]')
      const incoming = document.querySelector<HTMLElement>('[data-page-transition-incoming]')
      const shade = document.querySelector<HTMLElement>('[data-page-transition-shade]')

      if (!outgoing || !incoming || !shade) return null

      return {
        incomingY: incoming.getBoundingClientRect().y,
        outgoingPosition: getComputedStyle(outgoing).position,
        outgoingY: outgoing.getBoundingClientRect().y,
        shadeOpacity: Number.parseFloat(getComputedStyle(shade).opacity),
      }
    })

    expect(stack).toMatchObject({ outgoingPosition: 'fixed' })
    expect(stack?.outgoingY).toBeLessThan(0)
    expect(stack?.outgoingY).toBeGreaterThanOrEqual(-135)
    expect(stack?.incomingY).toBeGreaterThan(0)
    expect(stack?.incomingY).toBeLessThan(900)
    expect(stack?.shadeOpacity).toBeGreaterThan(0)
    expect(stack?.shadeOpacity).toBeLessThanOrEqual(0.5)

    await expect(transition).toHaveAttribute('data-page-transition-state', 'idle', {
      timeout: 2500,
    })
    await expect(blocker).toHaveAttribute('data-active', 'false')
    await expect(page.locator('[data-page-transition-frame]')).toHaveCount(1)
    await expect(page.locator('main#main-content')).toHaveCount(1)
  })

  test('skips stacked page motion when reduced motion is requested', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('http://localhost:3000/about')
    await page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'services' })
      .click()

    await expect(page).toHaveURL('http://localhost:3000/approach')
    await expect(page.locator('[data-page-transition]')).toHaveAttribute(
      'data-page-transition-state',
      'idle',
    )
    await expect(page.locator('[data-page-transition-frame]')).toHaveCount(1)
    await expect(page.locator('[data-page-transition-blocker]')).toHaveAttribute(
      'data-active',
      'false',
    )
  })

  test('renders the branded reference footer responsively', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.setViewportSize({ height: 1000, width: 1440 })
    await page.goto('http://localhost:3000/about')

    const footer = page.locator('footer')
    const footerNav = page.getByRole('navigation', { name: 'Footer navigation' })
    const footerInner = footer.locator('> div').filter({ has: footerNav })
    const footerLogo = footer.getByRole('link', { name: 'Vorteks Digital home' }).locator('img')
    const resolveSharedBackground = () =>
      page.evaluate(() => {
        const probe = document.createElement('span')
        probe.style.backgroundColor = 'var(--background)'
        document.body.append(probe)
        const background = getComputedStyle(probe).backgroundColor

        probe.remove()
        return background
      })

    await expect(footer).toHaveCSS('background-color', await resolveSharedBackground())
    await expect(footer).toHaveCSS('margin', '0px')
    await expect(footer).toHaveCSS('border-radius', '0px')
    expect(
      await footerInner.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).paddingLeft),
      ),
    ).toBeCloseTo(1440 * 0.05291, 1)
    await page.setViewportSize({ height: 1000, width: 3000 })
    await expect(footerInner).toHaveCSS('padding-left', '96px')
    await expect(footerInner).toHaveCSS('padding-right', '96px')
    await page.setViewportSize({ height: 1000, width: 1440 })
    await expect(footerNav.getByRole('link')).toHaveCount(6)
    await expect(footerNav.getByRole('link', { name: 'projects' })).toHaveAttribute(
      'href',
      '/projects',
    )
    await expect(footerNav.getByRole('link', { name: 'services' })).toHaveAttribute(
      'href',
      '/approach',
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
    await expect(footer).toHaveCSS('background-color', await resolveSharedBackground())
    await expect(footerLogo).toHaveCSS('filter', 'none')

    await page.setViewportSize({ height: 844, width: 390 })
    await expect(footer).toHaveCSS('min-height', '752px')
    await expect(footer).toHaveCSS('margin', '0px')
    await expect(footer).toHaveCSS('border-radius', '0px')
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
    await expect(footerNav).toBeVisible()
    await expect(footerLogo).toBeVisible()
  })

  test('renders the reference-driven 404 in light and dark modes', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.setViewportSize({ height: 900, width: 1440 })
    const response = await page.goto('http://localhost:3000/this-route-does-not-exist')

    expect(response?.status()).toBe(404)
    await expect(page).toHaveTitle('Page Not Found | Vorteks Digital')
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
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
  })

  test('loads the supplied blogs feed and menu route', async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 })
    const response = await page.goto('http://localhost:3000/blogs')

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle('Digital Insights for Startups | Vorteks Digital')
    await expect(page.locator('[data-route-shell]')).toHaveCount(1)
    const blogsHeading = page.getByRole('heading', { level: 1, name: 'Insights' })
    await expect(blogsHeading).toBeVisible()
    await expect(page.locator('[data-hero-image-reveal]')).toBeVisible()
    await expect(page.locator('[data-hero-image-reveal] img')).toHaveAttribute(
      'src',
      /johannesburg-sunset-skyline\.webp/,
    )
    await expect
      .poll(async () => {
        const mediaBounds = await page.locator('[data-hero-image-reveal]').boundingBox()
        const titleBounds = await page.locator('[data-hero-image-shift]').boundingBox()

        if (!mediaBounds || !titleBounds) return false

        return titleBounds.x >= mediaBounds.x + mediaBounds.width
      })
      .toBe(true)
    await expect(blogsHeading).toHaveCSS('text-transform', 'uppercase')
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
        blogsHeading.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    )
      .toBeCloseTo(100, 2)
    await expect(blogsHeading).toHaveCSS('font-weight', '800')
    await expect(page.getByRole('navigation', { name: 'Blog categories' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
    await expect(
      page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', {
        name: 'insights',
      }),
    ).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('section[aria-labelledby="blogs-title"] article')).toHaveCount(8)
    await expect(
      page.getByRole('heading', { name: 'Building Brands That Move at Digital Speed' }),
    ).toBeVisible()

    await page.setViewportSize({ height: 844, width: 390 })
    await expect
      .poll(() =>
        blogsHeading.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
      )
      .toBeCloseTo(37.2, 1)
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)

    const sitemap = await page.request.get('http://localhost:3000/pages-sitemap.xml')
    expect(await sitemap.text()).toContain('/blogs</loc>')
  })

  test('theme toggle changes the site palette and persists', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('http://localhost:3000')

    const desktopTheme = page.locator('#header-theme')
    const readPalette = (selector: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((element) => {
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
    await expect(page).toHaveTitle(/Vorteks Digital/)
    await expect(page.locator('.admin-bar')).toBeHidden()
    const heading = page.locator('h1').first()
    await expect(heading).toHaveAccessibleName("Shaping Tomorrow's brand Today")

    const heroVideo = page.locator('video').first()
    await expect(heroVideo).toHaveAttribute('poster', '/hero/johannesburg-sunset-poster.webp')
    await expect(heroVideo.locator('source')).toHaveAttribute(
      'src',
      '/hero/johannesburg-sunset.mp4',
    )
    await expect
      .poll(() =>
        heroVideo.evaluate((element) => {
          const video = element as HTMLVideoElement

          return video.readyState >= 1 && video.videoWidth === 1280 && video.videoHeight === 720
        }),
      )
      .toBe(true)

    const [videoResponse, posterResponse] = await Promise.all([
      page.request.get('/hero/johannesburg-sunset.mp4'),
      page.request.get('/hero/johannesburg-sunset-poster.webp'),
    ])
    expect(videoResponse.ok()).toBe(true)
    expect(videoResponse.headers()['content-type']).toContain('video/mp4')
    expect(posterResponse.ok()).toBe(true)
    expect(posterResponse.headers()['content-type']).toContain('image/webp')

    const headerBox = await page.locator('header').boundingBox()
    const mainBox = await page.locator('main').boundingBox()
    expect(headerBox?.y).toBe(0)
    expect(mainBox?.y).toBe(0)
  })

  test('renders the reference-led homepage story below the VRTKS hero', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto('http://localhost:3000')

    await expect(
      page.getByRole('heading', {
        name: /Digital support that fits the business/i,
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Direct partnership. Global delivery.' }),
    ).toBeVisible()
    await expect(page.locator('[data-home-project]')).toHaveCount(2)
    await expect(page.getByRole('heading', { name: /Signal Shift 2026/ })).toBeVisible()
    const services = page.locator('[data-home-services]')
    await expect(services.getByRole('button')).toHaveCount(3)
    await expect(services.getByRole('button', { name: 'Identities' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect
      .poll(async () => {
        const featureBounds = await services.locator('[data-home-service-feature]').boundingBox()
        const headingBounds = await services
          .getByRole('button', { name: 'Identities' })
          .boundingBox()

        return featureBounds && headingBounds
          ? Math.abs(featureBounds.y - headingBounds.y)
          : Number.POSITIVE_INFINITY
      })
      .toBeLessThan(1)
    await services.getByRole('button', { name: 'Systems' }).focus()
    await expect(services.getByRole('button', { name: 'Systems' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(services.getByRole('img', { name: /Glass-fronted modern buildings/ })).toHaveCSS(
      'opacity',
      '1',
    )
    await expect
      .poll(async () => {
        const featureBounds = await services.locator('[data-home-service-feature]').boundingBox()
        const headingBounds = await services.getByRole('button', { name: 'Systems' }).boundingBox()

        return featureBounds && headingBounds
          ? Math.abs(
              featureBounds.y +
                featureBounds.height / 2 -
                (headingBounds.y + headingBounds.height / 2),
            )
          : Number.POSITIVE_INFINITY
      })
      .toBeLessThan(1)
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(page.getByRole('link', { name: /See all projects/ })).toHaveAttribute(
      'href',
      '/projects',
    )

    const readGeometry = () =>
      page.evaluate(() => {
        const approach = document.querySelector<HTMLElement>('[data-home-approach]')
        const projects = document.querySelector<HTMLElement>('[data-home-projects]')
        const services = document.querySelector<HTMLElement>('[data-home-services]')
        const studio = document.querySelector<HTMLElement>('[data-home-studio]')
        const hero = document.querySelector<HTMLElement>('[aria-labelledby="home-hero-title"]')
        const studioMedia = studio?.querySelector('img')?.parentElement
        if (!approach || !projects || !services || !studio || !hero || !studioMedia)
          return null

        const approachBounds = approach.getBoundingClientRect()
        const heroBounds = hero.getBoundingClientRect()
        const studioMediaBounds = studioMedia.getBoundingClientRect()
        const heroPadding = Number.parseFloat(getComputedStyle(hero).paddingLeft)
        const textRailPaddings = [approach, services, studio].map((section) =>
          Number.parseFloat(getComputedStyle(section).paddingLeft),
        )
        const heroContentLeft = heroBounds.left + heroPadding

        return {
          approachY: approachBounds.y,
          heroHeight: heroBounds.height,
          servicesFollowProjects:
            services.getBoundingClientRect().top >= projects.getBoundingClientRect().bottom,
          studioFollowsServices:
            studio.getBoundingClientRect().top >= services.getBoundingClientRect().bottom,
          studioMediaRatio: studioMediaBounds.width / studioMediaBounds.height,
          textRailsMatchHero: textRailPaddings.every(
            (padding) => Math.abs(padding - heroPadding) < 0.1,
          ),
          wideMediaOutsideHeroRail: studioMediaBounds.left < heroContentLeft,
        }
      })

    await expect.poll(readGeometry).toMatchObject({
      approachY: expect.closeTo(900, 1),
      heroHeight: expect.closeTo(900, 1),
      servicesFollowProjects: true,
      studioFollowsServices: true,
      studioMediaRatio: expect.closeTo(4 / 5, 2),
      textRailsMatchHero: true,
      wideMediaOutsideHeroRail: true,
    })

    await page.setViewportSize({ height: 844, width: 390 })
    await expect.poll(readGeometry).toMatchObject({
      approachY: expect.closeTo(844, 1),
      heroHeight: expect.closeTo(844, 1),
      servicesFollowProjects: true,
      studioFollowsServices: true,
      studioMediaRatio: expect.closeTo(4 / 5, 2),
      textRailsMatchHero: true,
    })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
  })

  test('reveals service imagery and anchors panel across desktop headings', async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto('http://localhost:3000')

    const services = page.locator('[data-home-services]')
    const systems = services.getByRole('button', { name: 'Systems' })
    await systems.hover()
    await expect(services.locator('[data-home-services-showcase]')).toHaveCSS(
      'padding-bottom',
      '0px',
    )
    await expect(services.locator('[data-home-service-media]')).toHaveCSS(
      'background-color',
      'rgba(0, 0, 0, 0)',
    )

    const activeImage = services.getByRole('img', {
      name: /Glass-fronted modern buildings/,
    })
    const clipFrames = await activeImage.evaluate((image) =>
      image.getAnimations().flatMap((animation) => {
        const effect = animation.effect

        return effect instanceof KeyframeEffect
          ? effect
              .getKeyframes()
              .map((frame) => String(frame.clipPath))
              .filter((clipPath) => clipPath !== 'undefined')
          : []
      }),
    )
    expect(clipFrames[0]).toContain('100%')
    expect(clipFrames.at(-1)).toMatch(/^inset\(0/)

    await expect
      .poll(async () => {
        const featureBounds = await services.locator('[data-home-service-feature]').boundingBox()
        const headingBounds = await systems.boundingBox()

        return featureBounds && headingBounds
          ? Math.abs(
              featureBounds.y +
                featureBounds.height / 2 -
                (headingBounds.y + headingBounds.height / 2),
            )
          : Number.POSITIVE_INFINITY
      })
      .toBeLessThan(1)

    const guidelines = services.getByRole('button', { name: 'Guidelines' })
    await guidelines.hover()
    await expect
      .poll(async () => {
        const featureBounds = await services.locator('[data-home-service-feature]').boundingBox()
        const headingBounds = await guidelines.boundingBox()

        return featureBounds && headingBounds
          ? Math.abs(
              featureBounds.y + featureBounds.height - (headingBounds.y + headingBounds.height),
            )
          : Number.POSITIVE_INFINITY
      })
      .toBeLessThan(1)
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
    await expect
      .poll(() => toggleTrack.evaluate((element) => getComputedStyle(element).outlineStyle))
      .toBe('solid')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Close menu', exact: true }).last()).toBeFocused()

    await page.locator('label[for="mobile-header-theme"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect
      .poll(() => drawer.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe(lightDrawerBackground)
    await expect
      .poll(() => toggleTrack.evaluate((element) => getComputedStyle(element).outlineStyle))
      .toBe('none')

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
