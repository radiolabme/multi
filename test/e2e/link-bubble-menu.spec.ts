import { expect, test } from '@playwright/test';

test.describe('LinkBubbleMenu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.simple-editor-content');
  });

  test('shows link menu when cursor is in a link', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Insert link directly via HTML
    await page.evaluate(() => {
      const editorEl = document.querySelector('.simple-editor-content');
      if (editorEl) {
        editorEl.innerHTML = '<p><a href="https://example.com">Click here</a></p>';
      }
    });

    // Click in the link
    await editor.locator('a').click();

    // Wait for bubble menu
    await page.waitForTimeout(100);

    // Link bubble menu should appear
    await expect(page.locator('.bubble-menu--link')).toBeVisible();
  });

  test('displays edit, remove, and open buttons', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Insert link manually via HTML content
    await page.evaluate(() => {
      const editorEl = document.querySelector('.simple-editor-content');
      if (editorEl) {
        editorEl.innerHTML = '<p><a href="https://example.com">link text</a></p>';
      }
    });

    // Click in the link
    await editor.locator('a').click();

    // Check link menu is visible with all buttons
    const menu = page.locator('.bubble-menu--link');
    await expect(menu).toBeVisible();
    await expect(menu.locator('button[title="Edit Link"]')).toBeVisible();
    await expect(menu.locator('button[title="Remove Link"]')).toBeVisible();
    await expect(menu.locator('button[title="Open Link"]')).toBeVisible();
  });

  test('can remove link', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Insert link
    await page.evaluate(() => {
      const editorEl = document.querySelector('.simple-editor-content');
      if (editorEl) {
        editorEl.innerHTML = '<p><a href="https://example.com">link text</a></p>';
      }
    });

    await editor.locator('a').click();

    // Click remove button
    await page.locator('.bubble-menu--link button[title="Remove Link"]').click();

    // Link should be removed
    await expect(editor.locator('a')).toHaveCount(0);
    await expect(editor).toContainText('link text');
  });

  test('can edit link URL', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Insert link
    await page.evaluate(() => {
      const editorEl = document.querySelector('.simple-editor-content');
      if (editorEl) {
        editorEl.innerHTML = '<p><a href="https://example.com">link text</a></p>';
      }
    });

    await editor.locator('a').click();

    // Wait for bubble menu to appear
    await expect(page.locator('.bubble-menu--link')).toBeVisible();

    // Click edit button to show modal
    await page.locator('.bubble-menu--link button[title="Edit Link"]').click();

    // Wait for modal to appear
    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    // Modal should show "Edit Link" title
    await expect(modal.locator('.modal-title')).toHaveText('Edit Link');

    // URL input should be visible and pre-filled
    const urlInput = page.locator('input[data-testid="link-url-input"]');
    await expect(urlInput).toBeVisible();
    await expect(urlInput).toHaveValue('https://example.com');

    // Text input should be visible and pre-filled
    const textInput = page.locator('input[data-testid="link-text-input"]');
    await expect(textInput).toBeVisible();
    await expect(textInput).toHaveValue('link text');

    // Clear and enter new URL
    await urlInput.fill('https://newurl.com');

    // Save button should be enabled
    const saveButton = page.locator('button[data-testid="link-save-button"]');
    await expect(saveButton).toBeEnabled();
    await expect(saveButton).toHaveText('Save Link');

    // Click save button
    await saveButton.click();

    // Wait for modal to close
    await expect(modal).not.toBeVisible();

    // Check URL was updated
    await expect(editor.locator('a')).toHaveAttribute('href', 'https://newurl.com');
    await expect(editor.locator('a')).toHaveText('link text');
  });

  test('can cancel link edit with Escape key', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Insert link
    await page.evaluate(() => {
      const editorEl = document.querySelector('.simple-editor-content');
      if (editorEl) {
        editorEl.innerHTML = '<p><a href="https://example.com">link text</a></p>';
      }
    });

    await editor.locator('a').click();

    // Wait for bubble menu
    await expect(page.locator('.bubble-menu--link')).toBeVisible();

    // Click edit button to open modal
    await page.locator('.bubble-menu--link button[title="Edit Link"]').click();

    // Wait for modal to appear
    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    // URL input should be visible
    const urlInput = page.locator('input[data-testid="link-url-input"]');
    await expect(urlInput).toBeVisible();

    // Change the URL
    await urlInput.fill('https://newurl.com');

    // Press Escape to cancel
    await urlInput.press('Escape');

    // Wait for modal to close
    await expect(modal).not.toBeVisible();

    // URL should be unchanged
    await expect(editor.locator('a')).toHaveAttribute('href', 'https://example.com');
  });

  test('can edit link text and URL', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Insert link
    await page.evaluate(() => {
      const editorEl = document.querySelector('.simple-editor-content');
      if (editorEl) {
        editorEl.innerHTML = '<p><a href="https://example.com">old text</a></p>';
      }
    });

    await editor.locator('a').click();

    // Wait for bubble menu
    await expect(page.locator('.bubble-menu--link')).toBeVisible();

    // Click edit button to open modal
    await page.locator('.bubble-menu--link button[title="Edit Link"]').click();

    // Wait for modal to appear
    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    // Update URL
    const urlInput = page.locator('input[data-testid="link-url-input"]');
    await urlInput.fill('https://newsite.com');

    // Update text
    const textInput = page.locator('input[data-testid="link-text-input"]');
    await textInput.fill('new text');

    // Press Enter to save
    await textInput.press('Enter');

    // Wait for modal to close
    await expect(modal).not.toBeVisible();

    // Check both URL and text were updated
    await expect(editor.locator('a')).toHaveAttribute('href', 'https://newsite.com');
    await expect(editor.locator('a')).toHaveText('new text');
  });

  test('can cancel with X button', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Insert link
    await page.evaluate(() => {
      const editorEl = document.querySelector('.simple-editor-content');
      if (editorEl) {
        editorEl.innerHTML = '<p><a href="https://example.com">link text</a></p>';
      }
    });

    await editor.locator('a').click();

    // Wait for bubble menu
    await expect(page.locator('.bubble-menu--link')).toBeVisible();

    // Click edit button to open modal
    await page.locator('.bubble-menu--link button[title="Edit Link"]').click();

    // Wait for modal to appear
    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    // Change the URL
    const urlInput = page.locator('input[data-testid="link-url-input"]');
    await urlInput.fill('https://newurl.com');

    // Click X button to cancel
    await page.locator('.modal-close').click();

    // Wait for modal to close
    await expect(modal).not.toBeVisible();

    // URL should be unchanged
    await expect(editor.locator('a')).toHaveAttribute('href', 'https://example.com');
  });

  test('can click backdrop to cancel', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Insert link
    await page.evaluate(() => {
      const editorEl = document.querySelector('.simple-editor-content');
      if (editorEl) {
        editorEl.innerHTML = '<p><a href="https://example.com">link text</a></p>';
      }
    });

    await editor.locator('a').click();

    // Wait for bubble menu
    await expect(page.locator('.bubble-menu--link')).toBeVisible();

    // Click edit button to open modal
    await page.locator('.bubble-menu--link button[title="Edit Link"]').click();

    // Wait for modal to appear
    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    // Change the URL
    const urlInput = page.locator('input[data-testid="link-url-input"]');
    await urlInput.fill('https://newurl.com');

    // Click backdrop to cancel (click outside modal dialog)
    await page.locator('.modal-backdrop').click({ position: { x: 10, y: 10 } });

    // Wait for modal to close
    await expect(modal).not.toBeVisible();

    // URL should be unchanged
    await expect(editor.locator('a')).toHaveAttribute('href', 'https://example.com');
  });

  test('save button is disabled when URL is empty', async ({ page }) => {
    const editor = page.locator('.simple-editor-content');

    // Insert link
    await page.evaluate(() => {
      const editorEl = document.querySelector('.simple-editor-content');
      if (editorEl) {
        editorEl.innerHTML = '<p><a href="https://example.com">link text</a></p>';
      }
    });

    await editor.locator('a').click();

    // Wait for bubble menu
    await expect(page.locator('.bubble-menu--link')).toBeVisible();

    // Click edit button to open modal
    await page.locator('.bubble-menu--link button[title="Edit Link"]').click();

    // Wait for modal to appear
    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    const urlInput = page.locator('input[data-testid="link-url-input"]');
    const saveButton = page.locator('button[data-testid="link-save-button"]');

    // Clear the URL
    await urlInput.fill('');

    // Save button should be disabled
    await expect(saveButton).toBeDisabled();

    // Fill URL again
    await urlInput.fill('https://valid.com');

    // Save button should be enabled
    await expect(saveButton).toBeEnabled();
  });
});
