# Testing Strategy

This document outlines the testing approach, tools, and current coverage status for the AI-JOB/ai project.

**Last Updated:** 2026-04-19

## Current Status

As of development phase 1, **automated testing has not been integrated into the codebase.**
- **Unit Tests**: 0% coverage.
- **Integration Tests**: 0% coverage.
- **E2E Tests**: 0% coverage.

## Primary Verification Method

Currently, verification is performed **manually** through the browser.

### Checklist for Manual Verification
1. **Responsiveness**: Verify UI integrity on mobile, tablet, and desktop viewports.
2. **Interactive Elements**: Confirm all buttons, forms, and modals trigger expected transitions.
3. **Data Integrity**: Verify that API-fetched data is rendered correctly and handled safely (loading/error states).
4. **i18n**: Ensure all text strings have valid translation keys and load based on the locale segment.

## Recommended Future Tools

To improve project stability, the following tools are recommended for integration:

### 1. Vitest (Unit & Component Testing)
- **Purpose**: Fast unit tests for utilities and unit/component tests for independent UI pieces.
- **Integration**: Works seamlessly with Vite and Next.js.

### 2. Playwright (End-to-End Testing)
- **Purpose**: Verifying critical user flows (Login, Search, Application Submission).
- **Benefit**: Robust cross-browser testing and visual regression capabilities.

### 3. Storybook (UI Documentation & Test)
- **Purpose**: Documenting and testing individual UI components in isolation, especially the premium glassmorphism effects.

## Best Practices for Future Tests

- **Mocking**: Use `msw` (Mock Service Worker) to simulate API responses for integration tests.
- **Naming**: Test files should follow the `*.test.ts` or `*.test.tsx` naming convention and reside next to the file they are testing.
- **Type Checking**: Rely on the TypeScript compiler and ESLint as the first line of defense against quality issues.
