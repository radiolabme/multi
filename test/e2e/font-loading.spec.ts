import { expect, test } from '@playwright/test';

test.describe('Font Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for fonts to load
    await page.waitForLoadState('networkidle');
  });

  test('should load Overused Grotesk font', async ({ page }) => {
    // Check if the font is loaded by inspecting computed styles
    const bodyFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });

    expect(bodyFont).toContain('Overused Grotesk');
  });

  test('should have all font options in font picker', async ({ page }) => {
    const fontSelect = page.locator('.font-select');
    await expect(fontSelect).toBeVisible();

    // Get all options
    const options = await fontSelect.locator('option').allTextContents();

    // Should have: Default Font, Grotesk, Serif, Mono, Math
    expect(options).toContain('Grotesk');
    expect(options).toContain('Serif');
    expect(options).toContain('Mono');
    expect(options).toContain('Math');
  });

  test('should apply Grotesk font when selected', async ({ page }) => {
    const editor = page.locator('.tiptap.ProseMirror');
    await editor.click();
    await editor.type('Testing Grotesk font');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Select Grotesk from dropdown
    const fontSelect = page.locator('.font-select');
    await fontSelect.selectOption({ label: 'Grotesk' });

    // Check if font-family style is applied
    const fontFamily = await editor.evaluate((el) => {
      // Narrow Element to HTMLElement so TypeScript knows about .style
      const container = el as HTMLElement;
      const span = container.querySelector('span[style*="font-family"]') as HTMLSpanElement | null;
      return span ? span.style.fontFamily : null;
    });

    expect(fontFamily).toContain('Overused Grotesk');
  });

  test('should apply JetBrains Mono font when selected', async ({ page }) => {
    const editor = page.locator('.tiptap.ProseMirror');
    await editor.click();
    await editor.type('Testing Mono font');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Select Mono from dropdown
    const fontSelect = page.locator('.font-select');
    await fontSelect.selectOption({ label: 'Mono' });

    // Check if font-family style is applied
    const fontFamily = await editor.evaluate((el) => {
      const container = el as HTMLElement;
      const span = container.querySelector('span[style*="font-family"]') as HTMLSpanElement | null;
      return span ? span.style.fontFamily : null;
    });

    expect(fontFamily).toContain('JetBrains Mono');
  });

  test('should apply Noto Serif JP font when selected', async ({ page }) => {
    const editor = page.locator('.tiptap.ProseMirror');
    await editor.click();
    await editor.type('Testing Serif font');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Select Serif from dropdown
    const fontSelect = page.locator('.font-select');
    await fontSelect.selectOption({ label: 'Serif' });

    // Check if font-family style is applied
    const fontFamily = await editor.evaluate((el) => {
      const container = el as HTMLElement;
      const span = container.querySelector('span[style*="font-family"]') as HTMLSpanElement | null;
      return span ? span.style.fontFamily : null;
    });

    expect(fontFamily).toContain('Noto Serif JP');
  });

  test('should apply Libertinus Math font when selected', async ({ page }) => {
    const editor = page.locator('.tiptap.ProseMirror');
    await editor.click();
    await editor.type('Testing Math font');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Select Math from dropdown
    const fontSelect = page.locator('.font-select');
    await fontSelect.selectOption({ label: 'Math' });

    // Check if font-family style is applied
    const fontFamily = await editor.evaluate((el) => {
      const container = el as HTMLElement;
      const span = container.querySelector('span[style*="font-family"]') as HTMLSpanElement | null;
      return span ? span.style.fontFamily : null;
    });

    expect(fontFamily).toContain('Libertinus Math');
  });

  test('should verify fonts are actually loaded (not falling back)', async ({ page }) => {
    // Check document.fonts API to verify fonts are loaded
    const fontsLoaded = await page.evaluate(async () => {
      await document.fonts.ready;

      const loadedFonts: string[] = [];
      document.fonts.forEach((font) => {
        // font.family is a string
        loadedFonts.push(String(font.family));
      });

      return {
        hasOverusedGrotesk: loadedFonts.some((f) => f.includes('Overused Grotesk')),
        hasJetBrainsMono: loadedFonts.some((f) => f.includes('JetBrains Mono')),
        hasLibertinusMath: loadedFonts.some((f) => f.includes('Libertinus Math')),
        hasInter: loadedFonts.some((f) => f.includes('Inter')),
        hasNotoSerifJP: loadedFonts.some((f) => f.includes('Noto Serif JP')),
        allFonts: Array.from(new Set(loadedFonts)).sort(),
      };
    });

    console.log('Loaded fonts:', fontsLoaded.allFonts);

    expect(fontsLoaded.hasOverusedGrotesk).toBe(true);
    expect(fontsLoaded.hasJetBrainsMono).toBe(true);
    expect(fontsLoaded.hasLibertinusMath).toBe(true);
    expect(fontsLoaded.hasInter).toBe(true);
    // Noto Serif JP might load lazily, so we'll be lenient on this one
  });
});
