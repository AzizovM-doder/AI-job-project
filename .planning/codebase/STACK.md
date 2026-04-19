# Technology Stack

This document outlines the core technologies, languages, and frameworks used in the AI-JOB/ai project.

**Last Updated:** 2026-04-19

## Core Languages & Runtimes

- **TypeScript 5.x**: Primary development language for source code and configuration.
- **Node.js**: Underlying runtime environment.
- **JavaScript (ESM)**: Used for select configuration files (`generate.mjs`, `postcss.config.mjs`).

## Frameworks & Core Libraries

- **Next.js 16.2.3**: Application framework (utilizing App Router and Canary features).
- **React 19.2.4**: UI library, using latest hooks and server components.
- **v8.8.0**: API client generator for React Query.

## Styling & UI

- **Tailwind CSS 4**: Next-generation utility-first CSS framework.
- **Framer Motion 12.x**: High-performance production-ready motion library.
- **Radix UI**: Primitive headless components for accessibility.
- **Shadcn UI 4.x**: Component architecture for consistent, premium styling.
- **Lucide React**: Vector icon library.
- **tw-animate-css**: Utility for complex animations.

## State Management & Data Fetching

- **Zustand 5.x**: Lightweight and flexible client-side state management.
- **TanStack React Query 5.x**: Server state management and data synchronization.
- **Axios 1.15.x**: Promise-based HTTP client for API requests.
- **React Hook Form 7.x**: Performant, flexible, and extensible forms with validation.
- **Zod 4.x**: TypeScript-first schema declaration and validation.

## 3D & Graphics

- **Three.js 0.184.x**: Core 3D engine.
- **@react-three/fiber 9.x**: React renderer for Three.js.
- **@react-three/drei 10.x**: Essential helpers and abstractions for R3F.

## Core Utilities

- **next-intl 4.x**: Internationalization (i18n) framework for Next.js.
- **next-themes**: Dark mode and theme management.
- **date-fns 4.x**: Modern JavaScript date utility library.
- **clsx / tailwind-merge**: Utilities for conditional CSS classes and conflict resolution.

## Build & Quality

- **ESLint 9.x**: Pluggable linting utility for JavaScript and TypeScript.
- **TypeScript Compiler**: Static type checking and transpilation.
- **PostCSS**: CSS transformation.
