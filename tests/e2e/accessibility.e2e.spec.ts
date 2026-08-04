import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('public accessibility', () => {
  for (const colorScheme of ['light', 'dark'] as const) {
    for (const route of ['/', '/projects', '/approach', '/about', '/blogs', '/contact', '/posts']) {
      test(`${route} has no detectable WCAG A/AA violations in ${colorScheme} mode`, async ({
        page,
      }) => {
        await page.emulateMedia({ colorScheme })
        await page.goto(route)
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
        expect(results.violations).toEqual([])
      })
    }

    test(`404 has no detectable WCAG A/AA violations in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme })
      const response = await page.goto('/this-route-does-not-exist')
      expect(response?.status()).toBe(404)

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()

      expect(results.violations).toEqual([])
    })
  }
})
