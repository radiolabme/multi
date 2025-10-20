import { expect, test } from '@playwright/test';

test.describe('TextBubbleMenu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.simple-editor-content');
  });

  test('shows text formatting menu when text is selected', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Type some text
    await editor.click();
    await page.keyboard.type('Hello world');

    // Select text by triple-clicking (selects paragraph)
    await editor.click({ clickCount: 3 });

    // Wait for bubble menu to appear
    await page.waitForTimeout(100); // Small delay for bubble menu to render
    await expect(page.locator('.bubble-menu').first()).toBeVisible();
  });

  test('can apply bold formatting', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Type text (clicking will dismiss placeholder)
    await editor.click();
    await page.keyboard.type('Bold text');

    // Select all using Cmd+A
    await page.keyboard.press('Meta+a');

    // Wait for bubble menu and click bold button
    await page.waitForTimeout(100);
    await page.locator('.bubble-menu button[title="Bold (Cmd+B)"]').click();

    // Check for bold element (use .last() to get the newest one)
    await expect(editor.locator('strong').last()).toContainText('Bold text');
  });
  test('can apply italic formatting', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Type text
    await editor.click();
    await page.keyboard.type('Italic text');

    // Select all using Cmd+A
    await page.keyboard.press('Meta+a');

    // Wait for bubble menu and click italic button
    await page.waitForTimeout(100);
    await page.locator('.bubble-menu button[title="Italic (Cmd+I)"]').click();

    await expect(editor.locator('em').last()).toContainText('Italic text');
  });
  test('can apply strikethrough formatting', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Type text
    await editor.click();
    await page.keyboard.type('Strike text');

    // Select all using Cmd+A
    await page.keyboard.press('Meta+a');

    // Wait for bubble menu and click strikethrough button
    await page.waitForTimeout(100);
    await page.locator('.bubble-menu button[title="Strikethrough"]').click();

    await expect(editor.locator('s').last()).toContainText('Strike text');
  });
  test('shows active state for bold text', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    await editor.click();
    // Clear the placeholder text first
    await page.keyboard.press('Control+a');
    await page.keyboard.type('Bold text');
    await editor.click({ clickCount: 3 });

    // Apply bold
    await page.waitForTimeout(100);
    await page.locator('.bubble-menu button[title="Bold (Cmd+B)"]').click();

    // Select the bold text again
    await editor.click({ clickCount: 3 });
    await page.waitForTimeout(100);

    // Bold button should have active class
    await expect(page.locator('.bubble-menu button[title="Bold (Cmd+B)"]')).toHaveClass(
      /is-active/
    );
  });

  test('hides menu when clicking outside', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    await editor.click();
    await page.keyboard.type('Some text');
    await editor.click({ clickCount: 3 });

    // Menu should be visible
    await page.waitForTimeout(100);
    await expect(page.locator('.bubble-menu').first()).toBeVisible();

    // Click outside
    await page.locator('body').click({ position: { x: 10, y: 10 } });

    // Menu should be hidden
    await expect(page.locator('.bubble-menu').first()).toBeHidden();
  });
});
