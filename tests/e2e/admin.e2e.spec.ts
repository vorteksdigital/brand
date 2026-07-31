import { test, expect, Page } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin Panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async () => {
    await page.goto('http://localhost:3000/admin')
    await expect(page).toHaveURL('http://localhost:3000/admin')
    const dashboardArtifact = page.locator('span[title="Dashboard"]').first()
    await expect(dashboardArtifact).toBeVisible()
  })

  test('can navigate to list view', async () => {
    await page.goto('http://localhost:3000/admin/collections/users')
    await expect(page).toHaveURL(/\/admin\/collections\/users(?:\?|$)/)
    const listViewArtifact = page.locator('h1', { hasText: 'Users' }).first()
    await expect(listViewArtifact).toBeVisible()
  })

  test('can navigate to edit view', async () => {
    await page.goto('http://localhost:3000/admin/collections/pages/create')
    await expect(page).toHaveURL(/\/admin\/collections\/pages\/[a-zA-Z0-9-_]+/)
    const editViewArtifact = page.locator('input[name="title"]')
    await expect(editViewArtifact).toBeVisible()
  })

  test('authenticated Admin bar pushes the public layout down', async () => {
    await page.goto('http://localhost:3000')

    const adminBar = page.locator('.admin-bar')
    await expect(adminBar).toBeVisible()

    const adminBarBox = await adminBar.boundingBox()
    const headerBox = await page.locator('header').boundingBox()
    const mainBox = await page.locator('main').boundingBox()

    expect(adminBarBox).not.toBeNull()
    expect(headerBox).not.toBeNull()
    expect(mainBox).not.toBeNull()

    if (!adminBarBox || !headerBox || !mainBox) return

    expect(headerBox.y).toBeCloseTo(adminBarBox.height, 0)
    expect(mainBox.y).toBeCloseTo(adminBarBox.height, 0)
  })
})
