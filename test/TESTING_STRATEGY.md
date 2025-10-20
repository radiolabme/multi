# Testing Strategy

## Overview

49 unit tests + 26 E2E tests:

- 49 unit tests (Vitest + jsdom) - ~1.5s runtime - ✅ All passing
- 26 E2E tests (Playwright + Chromium) - ~30s runtime - 16/26 passing

**Known E2E issues:**

- Bubble menu timing/visibility (text selection doesn't trigger bubble menu)
- Link creation via prompt dialog
- Table cell selection for merge operations

## Running Tests

```bash
npm test                    # Unit tests (watch mode)
npm test -- --run          # Unit tests (once)
npm run test:e2e           # E2E tests
npm run test:all           # Everything
```

## What Gets Tested Where

**Unit tests:** Business logic, table commands, predicates, error handling, component structure

**E2E tests:** Editor interactions, bubble menu positioning and behavior, text/link/table editing workflows

## Directory Structure

```text
test/
├── e2e/                      # Playwright specs
├── unit/                     # Vitest specs
├── fixtures/                 # Test data
├── helpers/                  # Test utilities
├── setup/                    # Test configuration
├── playwright-report/        # Generated HTML reports
└── test-results/            # Test artifacts
```

## CI Integration

```yaml
- run: npm test -- --run
- run: npx playwright install --with-deps chromium
- run: npm run test:e2e
- uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: test-reports
    path: test/playwright-report/
```

## Debugging

**Unit tests:** `npm run test:ui` for interactive mode

**E2E tests:** `npm run test:e2e:headed` to see the browser, or `npm run test:e2e:ui` for step-through debugging
