# Directory Structure

This document outlines the organization and directory layout of the AI-JOB/ai codebase.

**Last Updated:** 2026-04-19

## Root Directory

| Folder / File | Purpose |
| :--- | :--- |
| `.agent/` | AI agent specific configuration and skills. |
| `.planning/` | Project planning, roadmap, and codebase mapping (GSD). |
| `messages/` | Internationalization (i18n) translation JSON files. |
| `public/` | Static assets (fonts, images, icons). |
| `src/` | Main application source code. |
| `next.config.ts` | Next.js configuration. |
| `swagger.json` | OpenAPI/Swagger specification for the backend. |
| `package.json` | Project dependencies and scripts. |

## Source Directory (`src/`)

```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, API)
│   └── [locale]/         # Multilingual routing segment
│       ├── (auth)/       # Authentication related pages (grouped)
│       ├── jobs/         # Job discovery and listing
│       ├── networking/   # Networking and connections
│       ├── organization/ # Organization management dashboard
│       ├── organizations/# Public organization profiles
│       ├── profile/      # User profile management
│       ├── search/       # Global search interface
│       └── globals.css   # Main stylesheet
├── components/           # Shared React components
│   ├── ui/               # Tailored Shadcn UI primitives
│   ├── shared/           # Cross-feature utility components
│   └── layout/           # Global fragments (Navbar, Footer)
├── store/                # Zustand global state definitions
├── hooks/                # Custom React hooks
│   └── api/              # Orval-generated API hooks
├── lib/                  # Utilities, formatters, and API instance
├── types/                # TypeScript interfaces and schemas
│   └── api/              # Orval-generated API schemas
└── messages/             # (Alias or local messages)
```

## Key Feature Locations

- **Organization Dashboard**: `src/app/[locale]/organization/dashboard/`
- **User Discovery**: `src/app/[locale]/search/`
- **API Models**: `src/types/api/`
- **Global Theme Logic**: `src/app/[locale]/layout.tsx` (using `next-themes`)

## Naming Conventions

- **Directories**: lowercase, kebab-case (e.g., `user-profile`).
- **Components**: PascalCase (e.g., `GraduateCard.tsx`).
- **Hooks**: camelCase (prefix with `use`, e.g., `useAuth.ts`).
- **Utility/Consts**: camelCase or snake_case for constants (e.g., `apiInstance.ts`, `ENV_VARS.ts`).
