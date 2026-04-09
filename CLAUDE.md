# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start dev server on port 8080
bun run build        # Production build
bun run build:dev    # Development mode build
bun run lint         # ESLint
bun run preview      # Preview production build
bun run test         # Run tests once (Vitest)
bun run test:watch   # Run tests in watch mode
```

Use **Bun** as the package manager (bun.lock is present).

## Architecture

**Seerah Journey Unveiled** is a bilingual (Arabic/English) educational SPA about the Prophet Muhammad's biography. Built with React 18 + TypeScript + Vite, styled with Tailwind CSS and shadcn-ui components.

**Backend**: Supabase (PostgreSQL + Auth). Auto-generated types live in `src/integrations/supabase/types.ts`. The client is in `src/integrations/supabase/client.ts`.

**Static data**: Several `src/data/` files hold hardcoded content (timeline events, map locations, paths, battle data) that supplements Supabase-managed content.

## Routing

All public pages are wrapped in `<Layout>` (navbar + footer). Admin pages use `<AdminLayout>` behind `<AdminProtectedRoute>`.

Public: `/`, `/journey`, `/character`, `/map`, `/library`, `/interactive-journey`, `/battle-of-badr`, `/event/:id`, `/event-graph`

Admin: `/admin/login`, `/admin`, `/admin/timeline`, `/admin/paths`, `/admin/locations`, `/admin/shamail`

## i18n

Custom context-based solution (no external i18n library):
- `src/i18n/LanguageContext.tsx` — `<LanguageProvider>`, `useLanguage()` hook
- `src/i18n/translations.ts` — all string keys for `ar` and `en`
- Language stored in `localStorage` under key `seerah-lang`; defaults to Arabic
- RTL is applied by setting `document.dir` on language change
- Font switches to "Noto Kufi Arabic" for Arabic, "Inter" for English

Always add new UI strings to both `ar` and `en` in `translations.ts`, then access them via the `t()` function from `useLanguage()`.

## UI Components

shadcn-ui components (Radix primitives) live in `src/components/ui/`. Add new shadcn components with `bunx --bun shadcn-ui@latest add <component>`.

## Key Libraries

| Purpose | Library |
|---|---|
| Routing | React Router v6 |
| Data fetching | TanStack React Query |
| Forms | React Hook Form + Zod |
| Maps | Leaflet + react-leaflet |
| Charts/graphs | Recharts |
| Animations | Framer Motion |
| Notifications | sonner |

## Testing

Tests use Vitest with jsdom. Global setup is in `src/test/setup.ts`. There are currently very few tests — new feature tests should be placed in `src/test/`.
