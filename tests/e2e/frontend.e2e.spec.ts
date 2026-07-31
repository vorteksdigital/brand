import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/VRTKS Digital/)
    const heading = page.locator('h1').first()
    await expect(heading).toHaveAccessibleName("Shaping Tomorrow's brand Today")
  })

  test('mobile header menu manages focus, scrolling, and theme', async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto('http://localhost:3000')

    const menuButton = page.getByRole('button', { name: 'Open menu' })
    await menuButton.click()

    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('dialog', { name: 'Mobile navigation' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Close menu', exact: true }).last()).toBeFocused()
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')

    await page.keyboard.press('Shift+Tab')
    await expect(page.locator('#mobile-header-theme')).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Close menu', exact: true }).last()).toBeFocused()

    await page.locator('label[for="mobile-header-theme"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

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

    await page.setViewportSize({ height: 844, width: 820 })

    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
  })
})
