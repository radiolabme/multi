import { expect, test } from '@playwright/test';

test.describe('SimpleEditor Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads editor successfully', async ({ page }) => {
    await expect(page.locator('.simple-editor-content')).toBeVisible();
  });

  test('editor is editable', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');
    await expect(editor).toHaveAttribute('contenteditable', 'true');
  });

  test('can type in editor', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    await editor.click();
    await page.keyboard.type('Hello from Playwright!');

    await expect(editor).toContainText('Hello from Playwright!');
  });

  test('shows toolbar', async ({ page }) => {
    await expect(page.locator('.simple-editor-toolbar')).toBeVisible();
  });

  test('toolbar buttons are interactive', async ({ page }) => {
    // Check that toolbar has clickable buttons
    const boldButton = page.locator('button[title*="Bold"]');
    await expect(boldButton).toBeVisible();
    await expect(boldButton).toBeEnabled();
  });
});
