# External Integrations

This document describes how the AI-JOB/ai project interacts with external services, APIs, and data sources.

**Last Updated:** 2026-04-19

## API Services

### Core Backend API
The project integrates with a backend service defined by a Swagger/OpenAPI specification.
- **Reference File**: `swagger.json` (Root directory)
- **Protocol**: HTTP/S with JSON payloads.
- **Core Entities**: Endorsement, Language, ProfileSkill, Recommendation, etc.

### API Client Generation
We use **Orval** to automatically generate typed React Query hooks and custom TypeScript interfaces from the Swagger specification.
- **Configuration**: `orval.config.ts`
- **Output Hook Location**: `src/hooks/api/` (Split by tags)
- **Schema Location**: `src/types/api/`
- **Generated Client**: `react-query`

### Custom Request Instance
API requests are managed through a custom Axios instance to handle common logic like authentication headers and error responses.
- **Location**: `src/lib/api.ts`
- **Export Name**: `customInstance`

## 3D & Visualization

### Three.js / React Three Fiber
The application features immersive 3D elements (e.g., interactive globes or environmental scenes) powered by the Three.js ecosystem.
- **Library**: `three`, `@react-three/fiber`, `@react-three/drei`
- **Usage**: High-end visual overlays and background interactions.

## Content & i18n

### Internationalization (i18n)
Localization is handled on the server and client using `next-intl`.
- **Framework**: `next-intl`
- **Translation Keys**: `messages/` (JSON files for supported locales)
- **Routing**: Locale-based URL segments (`/[locale]/...`)

## Identity & State

### Theming
Consistent visual modes (Light/Dark) are managed via `next-themes`.
- **Library**: `next-themes`
- **Integration**: Tailwind CSS dark mode utilities.

### State Persistence
Select client-side state is managed by **Zustand**.
- **Location**: `src/store/`
- **Storage**: (Check `src/store` for persistence logic if used).
