# Technical Concerns & Debt

This document tracks known technical debt, potential risks, and areas of concern within the AI-JOB/ai project.

**Last Updated:** 2026-04-19

## Technical Debt

### 1. Zero Test Coverage
- **Status**: Critical.
- **Concern**: There are no automated tests (unit, integration, or E2E). This significantly increases the risk of regressions during refactoring or when adding new features.
- **Mitigation**: Prioritize the setup of Vitest or Playwright in the next milestone.

### 2. Redundant/Mispurposed Files
- **Status**: Moderate.
- **Concern**: `task.md` currently contains raw Swagger API definitions instead of actionable development tasks. This can be confusing for new developers or manual task tracking.
- **Mitigation**: Move the API documentation to a more appropriate reference folder and restore `task.md` as a progress tracker.

### 3. Missing i18n Keys
- **Status**: Moderate.
- **Concern**: Occasional reports of missing translation keys in the authentication and registration flows.
- **Mitigation**: Conduct a systematic audit of `messages/*.json` against all `useTranslations` calls in the `src/` directory.

## Performance Risks

### 1. Heavy UI Rendering
- **Status**: Low.
- **Concern**: Extensive use of glassmorphism (backdrop filters), Framer Motion, and Three.js might lead to frame drops on lower-end devices or older browsers.
- **Mitigation**: Monitor performance metrics and implement conditional rendering or simplified styles for performance-constrained environments.

### 2. API Response Handling
- **Status**: Low.
- **Concern**: Large payloads in `swagger.json` might lead to bloated generated hooks if not carefully managed.
- **Mitigation**: Use Orval's selective generation if only a subset of endpoints is needed for specific features.

## Security Concerns

### 1. Client-Side Secrets
- **Status**: Low.
- **Concern**: Risk of accidental leak of API keys or sensitive environment variables in client-side code.
- **Mitigation**: Strict enforcement of `.env` patterns and regular scans of generated documentation (e.g., during GSD mapping).

## Documentation Gaps

- **Status**: Moderate.
- **Concern**: While the GSD map provides high-level visibility, specific feature logic (e.g., CV Analysis algorithms) is not yet fully documented.
- **Mitigation**: Update `PROJECT.md` and feature-specific READMEs as implementation progresses.
