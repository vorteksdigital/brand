import { chromium } from '@playwright/test'

const baseURL = process.env.QC_BASE_URL || 'http://localhost:3011'
const routes = [
  '/',
  '/approach',
  '/about',
  '/projects',
  '/blogs',
  '/contact',
  '/services/web-design',
  '/services/web-development',
  '/services/wordpress-development',
  '/services/digital-products',
  '/cookie-policy',
  '/image-credits',
]
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
]

const browser = await chromium.launch({ headless: true })
const findings = []

for (const viewport of viewports) {
  for (const route of routes) {
    const page = await browser.newPage({ reducedMotion: 'reduce', viewport })
    const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'load' })
    await page.evaluate(async () => {
      const distance = Math.max(document.documentElement.scrollHeight - innerHeight, 0)
      for (const progress of [0.25, 0.5, 0.75, 1]) {
        scrollTo(0, distance * progress)
        await new Promise((resolve) => setTimeout(resolve, 80))
      }
      await Promise.race([
        Promise.allSettled(
          [...document.querySelectorAll('main img')].map((image) => image.decode()),
        ),
        new Promise((resolve) => setTimeout(resolve, 1200)),
      ])
      scrollTo(0, 0)
    })
    await page.waitForTimeout(100)
    const result = await page.evaluate(async () => {
      const visible = (element) => {
        if (element.closest('[data-site-preloader]')) return false
        if (element.closest('[role="dialog"]')) return false
        const rect = element.getBoundingClientRect()
        if (rect.width <= 1 || rect.height <= 1) return false
        let current = element
        while (current) {
          const style = getComputedStyle(current)
          if (
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            Number(style.opacity) === 0
          ) {
            return false
          }
          current = current.parentElement
        }
        return true
      }
      const label = (element) =>
        `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${
          typeof element.className === 'string' && element.className
            ? `.${element.className.split(' ').slice(0, 2).join('.')}`
            : ''
        }`
      const overlaps = (first, secondRect) => {
        const a = first.getBoundingClientRect()
        const b = secondRect
        const width = Math.min(a.right, b.right) - Math.max(a.left, b.left)
        const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
        return width > 4 && height > 4
      }

      const images = [...document.querySelectorAll('main img')].filter(visible)
      const text = [
        ...document.querySelectorAll('main h1,main h2,main h3,main p,main a,main button'),
      ].filter(visible)
      const collisions = []

      for (const image of images) {
        for (const item of text) {
          if (image.contains(item) || item.contains(image)) continue
          if (image.closest('a') === item.closest('a') && image.closest('a')) continue
          if (
            image.closest('[data-hero-title-wrap]') &&
            image.closest('[data-hero-title-wrap]') === item.closest('[data-hero-title-wrap]')
          ) {
            continue
          }
          const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT)
          let node = walker.nextNode()
          while (node) {
            if (node.textContent?.trim()) {
              const range = document.createRange()
              range.selectNodeContents(node)
              if ([...range.getClientRects()].some((rect) => overlaps(image, rect))) {
                collisions.push(`${label(image)} <> ${label(item)}`)
                break
              }
            }
            node = walker.nextNode()
          }
        }
      }

      const clippedText = text
        .filter((element) => {
          const overflow = getComputedStyle(element).overflowX
          return (
            (overflow === 'hidden' || overflow === 'clip') &&
            element.scrollWidth > element.clientWidth + 2
          )
        })
        .map(label)

      const failedImages = []
      await Promise.all(
        [...document.querySelectorAll('main img')].map(async (image) => {
          const source = image.currentSrc || image.src
          if (!source) return
          try {
            const response = await fetch(source)
            if (!response.ok) failedImages.push(source)
          } catch {
            failedImages.push(source)
          }
        }),
      )

      const largeGaps = [...document.querySelectorAll('main section')]
        .filter(visible)
        .flatMap((section) => {
          const sectionRect = section.getBoundingClientRect()
          if (sectionRect.height < innerHeight * 1.15) return []
          const children = [...section.children]
            .filter(visible)
            .map((child) => child.getBoundingClientRect())
            .sort((a, b) => a.top - b.top)
          if (!children.length)
            return [`${label(section)}: empty ${Math.round(sectionRect.height)}px`]
          const gaps = [children[0].top - sectionRect.top]
          for (let index = 1; index < children.length; index += 1) {
            gaps.push(children[index].top - children[index - 1].bottom)
          }
          gaps.push(sectionRect.bottom - children.at(-1).bottom)
          const largest = Math.max(...gaps)
          return largest > innerHeight * 0.58
            ? [`${label(section)}: ${Math.round(largest)}px blank`]
            : []
        })

      return {
        collisions: [...new Set(collisions)],
        clippedText: [...new Set(clippedText)],
        failedImages: [...new Set(failedImages)],
        horizontalOverflow:
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
        largeGaps,
      }
    })

    if (
      !response?.ok() ||
      result.collisions.length ||
      result.clippedText.length ||
      result.failedImages.length ||
      result.horizontalOverflow > 1 ||
      result.largeGaps.length
    ) {
      findings.push({ route, status: response?.status(), viewport, ...result })
    }
    await page.close()
  }
}

await browser.close()
process.stdout.write(`${JSON.stringify({ findings }, null, 2)}\n`)
