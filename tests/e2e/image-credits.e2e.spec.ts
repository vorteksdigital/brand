import { expect, test } from '@playwright/test'

test.describe('Image credits', () => {
  test('serves local editorial images with visible source and licence records', async ({
    page,
  }) => {
    const response = await page.goto('/image-credits')

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle('Image Credits | Vorteks Digital')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Editorial photography and motion' }),
    ).toBeVisible()
    await expect(page.locator('main ol > li')).toHaveCount(13)
    await expect(page.getByRole('link', { name: 'Cosmos search used' })).toHaveCount(13)
    await expect(page.getByRole('link', { name: 'Pexels License' })).toHaveCount(8)
    await expect(page.getByRole('link', { name: 'Unsplash License' })).toHaveCount(5)

    const images = page.locator('main img')
    await expect(images).toHaveCount(12)
    for (let index = 0; index < 12; index += 1) {
      await images.nth(index).scrollIntoViewIfNeeded()
    }
    await expect
      .poll(() =>
        images.evaluateAll((elements) =>
          elements.every((element) => {
            const image = element as HTMLImageElement

            return (
              image.complete &&
              image.naturalWidth > 0 &&
              image.currentSrc.includes('%2Fimages%2Fjohannesburg%2F')
            )
          }),
        ),
      )
      .toBe(true)

    const video = page.locator('main video')
    await expect(video).toHaveCount(1)
    await video.scrollIntoViewIfNeeded()
    await expect(video).toHaveAttribute('src', '/hero/johannesburg-sunset.mp4')
    await expect
      .poll(() => video.evaluate((element) => (element as HTMLVideoElement).readyState >= 1))
      .toBe(true)

    await page.setViewportSize({ height: 844, width: 390 })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
    await expect(page.getByRole('link', { name: 'Image Credits' })).toHaveAttribute(
      'href',
      '/image-credits',
    )

    const sitemap = await page.request.get('/pages-sitemap.xml')
    expect(sitemap.ok()).toBe(true)
    expect(await sitemap.text()).toContain('/image-credits</loc>')
  })
})
