# Coding Conventions

This document outlines the coding standards, patterns, and best practices for the AI-JOB/ai project.

**Last Updated:** 2026-04-19

## General Principles

- **Immersive Esthetics**: All UI work should adhere to high-end design principles (glassmorphism, premium motion, polished typography).
- **Strict Typing**: All components, hooks, and utilities must be fully typed. Use `interface` for domain objects and `type` for compositions.
- **Atomic Components**: Favor small, composable components over monolithic files.

## Component Patterns

- **Definition**: Use Functional Components with `export default`.
- **Naming**: `PascalCase` for files and component names (e.g., `JobCard.tsx`).
- **Props**: Destructure props in the function signature. Use Zod for complex prop validation if shared across layers.
- **Server vs Client**: Default to Server Components. Mark with `'use client'` only when using hooks (state, effects) or browser APIs.

```tsx
// Example Pattern
import { FC } from 'react';

interface Props {
  title: string;
}

const MyComponent: FC<Props> = ({ title }) => {
  return <div className="glass-morphism p-4">{title}</div>;
};

export default MyComponent;
```

## Styling Conventions

- **Tailwind CSS 4**: Use utility classes exclusively. Avoid custom CSS files unless defining global animations or variables.
- **Glassmorphism**: Use `backdrop-blur-*`, `bg-opacity-*`, and subtle borders to create depth.
- **Variant Management**: Use `class-variance-authority` (CVA) for components with multiple states (e.g., Button colors, Card highlight).
- **Animations**: Use Framer Motion (`framer-motion`) for any element that enters/leaves or reacts to hover.

## Data Fetching & State

- **API Hooks**: Use generated hooks from `src/hooks/api/`. Do not write raw `fetch` or `axios` calls within components.
- **Shared State**: Use **Zustand** for transient UI state (e.g., sidebar collapse, active search filters).
- **Server State**: Use **TanStack Query** (managed via Orval hooks) for all backend data.

## Types & Validation

- **Location**: Store shared types in `src/types/`.
- **Validation**: Use **Zod** for schema validation, especially for form inputs and API response verification.
- **Models**: Business models should mirror the Swagger definition in `swagger.json`.

## Error Handling

- **API Errors**: Managed via the custom Axios instance in `src/lib/api.ts` and TanStack Query's `onError`.
- **UI Errors**: Use specialized "empty states" or Radix-based toast notifications (via `sonner`) for user feedback.
- **Boundaries**: Use React Error Boundaries for fragile feature zones (e.g., 3D canvas).
