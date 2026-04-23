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
bun run test <pattern>  # Run a single test file, e.g. bun run test example
```

Use **Bun** as the package manager (bun.lock is present).

## Architecture

**Seerah Journey Unveiled** is a bilingual (Arabic/English) educational SPA about the Prophet Muhammad's biography. Built with React 18 + TypeScript + Vite, styled with Tailwind CSS and shadcn-ui components.

**Backend**: Supabase (PostgreSQL + Auth). Auto-generated types live in `src/integrations/supabase/types.ts`. The client is in `src/integrations/supabase/client.ts` and reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` from env.

**Static data**: Several `src/data/` files hold hardcoded bilingual content that supplements Supabase-managed content:
- `seerahTimeline.ts` — `TimelineEvent[]`, ~40+ events 570–632 CE, fields use `title`/`titleEn` pattern
- `eventCategories.ts` — `EventCategory` union, `CategoryConfig[]` with Lucide icon names and `colorHsl` strings (canonical source, but many components duplicate these locally)
- `mapLocations.ts` / `mapPaths.ts` — SVG percentage-based `x`/`y` coords (not lat/lng)
- `badrBattleData.ts` — uses `{ ar, en }` objects for bilingual strings (inconsistent with the `title`/`titleEn` pattern elsewhere)
- `battlesData.ts` — `Battle[]` with `significance`, `result`, and `category` fields

**TypeScript**: `noImplicitAny`, `strictNullChecks`, and `noUnusedLocals` are all `false` in the tsconfig. Don't add unnecessary type annotations or null-guards beyond what the codebase already uses.

## Routing

Provider stack in `App.tsx` (outermost → innermost): `QueryClientProvider` → `LanguageProvider` → `AuthProvider` → `TooltipProvider` → `BrowserRouter`.

All public pages are wrapped in `<Layout>` (navbar + footer). Admin pages use `<AdminLayout>` behind `<AdminProtectedRoute>` (checks `user` + `isAdmin` from `useAuth`; redirects to `/admin/login` if unauthenticated). `AdminLayout` hardcodes `dir="ltr"` — the admin is intentionally LTR-only regardless of app language.

Public: `/`, `/journey`, `/character`, `/map`, `/library`, `/interactive-journey`, `/battle-of-badr`, `/battles`, `/event/:id`, `/event-graph`, `/quiz`, `/family-tree`, `/companions`, `/feedback`

Admin: `/admin/login`, `/admin`, `/admin/timeline`, `/admin/paths`, `/admin/locations`, `/admin/shamail`, `/admin/feedback`, `/admin/quiz`

## Static data vs. Supabase — which wins where

These pages query Supabase and ignore the static files: `JourneyPage`, `EventDetailPage` (Supabase first, falls back to `seerahTimeline.ts` by slug if not found), `InteractiveJourneyPage`, `CharacterPage`, `CompanionsPage`, `FamilyTreePage`, `QuizPage`.

`MapPage` reads **only** from `src/data/mapLocations.ts` and `src/data/mapPaths.ts` — it never queries the `map_locations` / `paths` Supabase tables (those tables are managed via admin pages but not consumed on the public map).

`BattleOfBadrPage` reads **only** from `src/data/badrBattleData.ts` — no Supabase query.

`BattlesPage` reads **only** from `src/data/battlesData.ts`.

## Auth

`src/hooks/useAuth.tsx` — `<AuthProvider>` context exposing `user`, `isAdmin`, `signIn`, `signUp`, `signOut`. Admin status is resolved by querying the `user_roles` Supabase table for `role = 'admin'`.

## i18n

Custom context-based solution (no external i18n library):
- `src/i18n/LanguageContext.tsx` — `<LanguageProvider>`, `useLanguage()` hook exposing `lang`, `setLang`, `t(key)`, `isRtl`
- `src/i18n/translations.ts` — all string keys for `ar` and `en`; `TranslationKey` type is derived from the `ar` key union (so missing an `en` key is a TS error)
- Language stored in `localStorage` under key `seerah-lang`; defaults to Arabic
- RTL is applied by setting `document.documentElement.dir` on language change
- Font is switched by setting `document.body.style.fontFamily` in JS (overrides the Tajawal CSS base-layer default): Noto Kufi Arabic for Arabic, Inter for English

Always add new UI strings to both `ar` and `en` in `translations.ts`, then access them via the `t()` function from `useLanguage()`.

## UI Components

shadcn-ui components (Radix primitives) live in `src/components/ui/`. Add new shadcn components with `bunx --bun shadcn-ui@latest add <component>`. The `@` alias maps to `./src`.

### Notable non-shadcn component patterns

**`DynIcon`** (`CharacterPage.tsx`) — a `forwardRef` wrapper that maps string icon names (from the `icon_name` DB column) to Lucide components at runtime. Use this pattern when rendering icons whose names are stored in Supabase.

**`BadrTacticalMap`** (`src/components/badr/`) — renders a fully custom inline SVG; does not use Leaflet or react-leaflet.

**`InteractiveJourneyPage`** initialises a raw Leaflet map via `useRef` (not `react-leaflet`), dynamically imports `leaflet.markercluster`, and drives a play/pause timeline scrubber over 570–632 CE. It is the most complex component (~700 lines).

**`EventGraphPage`** accepts a `?highlight=<id>` search param passed through to `EventRelationshipGraph` as `highlightEventId`.

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

Tests use Vitest with jsdom. Global setup is in `src/test/setup.ts` (imports `@testing-library/jest-dom`, mocks `window.matchMedia`). There are currently very few tests — new feature tests should be placed in `src/test/`.
