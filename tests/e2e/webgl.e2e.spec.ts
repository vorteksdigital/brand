import { expect, test } from '@playwright/test'

test.use({
  launchOptions: {
    args: [
      '--enable-unsafe-swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-angle=swiftshader',
    ],
  },
})

test.describe('Homepage WebGL', () => {
  test('keeps the homepage usable when shader precision is unavailable', async ({ page }) => {
    const fluidWarnings: string[] = []

    page.on('console', (message) => {
      if (message.text().includes('homepage fluid effect')) fluidWarnings.push(message.text())
    })
    await page.addInitScript(() => {
      for (const contextConstructor of [
        window.WebGLRenderingContext,
        window.WebGL2RenderingContext,
      ]) {
        if (!contextConstructor) continue

        Object.defineProperty(contextConstructor.prototype, 'getShaderPrecisionFormat', {
          configurable: true,
          value: () => null,
        })
      }
    })

    const response = await page.goto('http://localhost:3000')

    expect(response?.status()).toBe(200)
    await expect(page.locator('h1').first()).toHaveAccessibleName(
      "Shaping Tomorrow's brand Today",
    )
    expect(fluidWarnings).toEqual([])
  })

  test('starts the fluid canvas after client navigation', async ({ page }) => {
    await page.goto('http://localhost:3000/about')
    await page
      .getByRole('banner')
      .getByRole('link', { name: 'VRTKS Digital home' })
      .click()

    const canvas = page.locator('canvas')
    await expect(canvas).toHaveAttribute('data-engine', /three\.js/)
    await expect
      .poll(() =>
        canvas.evaluate(
          (element) =>
            (element as HTMLCanvasElement).getContext('webgl2')?.isContextLost() ?? true,
        ),
      )
      .toBe(false)
  })
})
