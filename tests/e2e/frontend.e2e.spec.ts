import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/VRTKS Digital/)
    const heading = page.locator('h1').first()
    await expect(heading).toHaveAccessibleName("Shaping Tomorrow's brand Today")
  })
})
