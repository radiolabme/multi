# Fonts Directory

This directory contains self-hosted font files for the TipTap editor.

## Required Fonts

### Overused Grotesk

**Primary typeface** for the editor interface and content.

**Where to obtain:**
- Download from [GitHub - RandomMaerks/Overused-Grotesk](https://github.com/RandomMaerks/Overused-Grotesk) (free, SIL Open Font License)
- ✅ **Recommended:** Free and open source

### Inter

**Alternative sans-serif** typeface for UI and content.

**Where to obtain:**
- Download from [Inter by Rasmus Andersson](https://rsms.me/inter/) (free, SIL Open Font License)
- Or load from Google Fonts: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap')`
- ✅ Already configured in the project

### Noto Serif JP

**Serif typeface** for elegant, book-like content styling.

**Where to obtain:**
- Load from Google Fonts CDN (recommended for performance)
- Or download from [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Serif+JP)
- ✅ Free and open source (SIL Open Font License)

**Required font files:**
```
overused-grotesk/
  ├── OverusedGrotesk-Light.woff2       (300 weight)
  ├── OverusedGrotesk-Regular.woff2     (400 weight)
  ├── OverusedGrotesk-Medium.woff2      (500 weight)
  ├── OverusedGrotesk-SemiBold.woff2    (600 weight)
  └── OverusedGrotesk-Bold.woff2        (700 weight)
```

**Installation:**
1. Obtain the font files (WOFF2 format recommended)
2. Place them in `public/fonts/overused-grotesk/`
3. Uncomment the `@font-face` declarations in `src/styles/fonts.css`

### Roboto Mono

**Monospace typeface** for code blocks and inline code.

✅ **Already loaded** from Google Fonts CDN - no installation needed.

### Libertinus Math

**Mathematical typesetting** for KaTeX support (future feature).

**Where to obtain:**
- [Libertinus Fonts on GitHub](https://github.com/alerque/libertinus) (free, open source)
- Or use alternative: [Latin Modern Math](http://www.gust.org.pl/projects/e-foundry/lm-math) (free)

**Required when KaTeX is added:**
```
libertinus-math/
  └── LibertinusMath-Regular.woff2
```

## Fallback Strategy

The design tokens include system font fallbacks, so the editor will work without custom fonts installed:

- **Sans-serif fallback:** System UI fonts (San Francisco, Segoe UI, etc.)
- **Monospace fallback:** System monospace fonts (SF Mono, Consolas, etc.)
- **Math fallback:** Standard math fonts available on most systems

## Font Loading Performance

All fonts use `font-display: swap` to prevent blocking page render while fonts load.

## License Compliance

**Important:** Ensure you have appropriate licenses for all commercial fonts before deploying to production.

- Overused Grotesk: OFL 1.1 (free to use)
- Roboto Mono: Apache License 2.0 (free to use)
- Libertinus Math: OFL 1.1 (free to use)
