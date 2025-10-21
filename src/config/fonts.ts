/**
 * Font Configuration
 *
 * Defines available font families for the editor's font picker.
 * These fonts should match the design tokens and be loaded in index.css
 */

export interface FontOption {
  /** Display name shown in UI */
  label: string;
  /** CSS font-family value */
  value: string;
  /** Optional description */
  description?: string;
  /** CSS variable reference from design tokens */
  cssVariable?: string;
}

/**
 * Available font families for the editor
 */
export const EDITOR_FONTS: FontOption[] = [
  {
    label: 'Grotesk',
    value: "'Overused Grotesk', sans-serif",
    description: 'Primary sans-serif typeface',
    cssVariable: 'var(--font-family-sans)',
  },
  {
    label: 'Serif',
    value: "'Noto Serif JP', serif",
    description: 'Elegant serif for content',
    cssVariable: 'var(--font-family-serif)',
  },
  {
    label: 'Mono',
    value: "'JetBrains Mono', monospace",
    description: 'Monospace for code',
    cssVariable: 'var(--font-family-mono)',
  },
  {
    label: 'Math',
    value: "'Libertinus Math', serif",
    description: 'Mathematical typesetting',
    cssVariable: 'var(--font-family-math)',
  },
];

/**
 * Get font family values for TipTap extension configuration
 */
export function getFontFamilyList(): string[] {
  return EDITOR_FONTS.map((font) => font.value);
}

/**
 * Get default font family
 */
export function getDefaultFont(): string {
  return EDITOR_FONTS[0].value;
}
