# Playwright E2E Tests

End-to-end tests for TipTap editor bubble menus and interactions.

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (interactive mode)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run both unit and E2E tests
npm run test:all
```

## Test Coverage

### ✅ Editor Basic (`editor-basic.spec.ts`)

- Editor loads and is visible
- Editor is editable
- Can type text
- Toolbar is visible
- Stats section updates

### ✅ Text Bubble Menu (`text-bubble-menu.spec.ts`)

- Menu appears on text selection
- Bold formatting
- Italic formatting
- Strikethrough formatting
- Active state indicators
- Menu hides on blur

### ✅ Link Bubble Menu (`link-bubble-menu.spec.ts`)

- Menu appears when cursor in link
- Displays current URL
- Remove link functionality
- Edit link URL
- Cancel edit

### ✅ Table Bubble Menu (`table-bubble-menu.spec.ts`)

- Menu appears when cursor in table
- Add row before/after
- Delete row
- Add column before/after
- Delete column
- Delete entire table
- Merge cells
- Navigation (next/previous cell)

## Why Playwright?

Bubble menus use TipTap's floating-ui which requires:

- Real DOM measurements (`getBoundingClientRect`)
- Actual positioning calculations
- Portal rendering

These don't work in jsdom (unit tests), so we use Playwright for:

- Real browser environment
- Accurate positioning
- User interaction simulation
- Visual verification

## Configuration

See `../playwright.config.ts` for:

- Test directory: `./test/e2e`
- Base URL: `http://localhost:3000`
- Browsers: Chromium (can add Firefox, WebKit)
- Dev server auto-start
- Trace on first retry (debugging)

## CI/CD

The configuration is CI-ready:

- Retries: 2 attempts in CI
- Workers: 1 in CI (serial execution)
- `forbidOnly`: Prevents `.only()` in CI

## Debugging

```bash
# Show browser while running
npm run test:e2e:headed

# Interactive UI with time travel debugging
npm run test:e2e:ui

# Generate trace (set in config on retry)
# View at: https://trace.playwright.dev
```
