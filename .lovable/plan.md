
Issue triage result:
- Backend data exists and is healthy:
  - `timeline_events`: 255 active+visible rows (and 4 rows at year 570).
  - `shamail_traits`: 5 active rows.
- Access rules are healthy:
  - Public read + admin manage policies are currently PERMISSIVE.
- The UI still shows empty content:
  - Interactive Journey shows `0 حدث` at year 570 (should not be 0 given DB data).
  - Character page shows no trait cards.
- In-browser behavior indicates frontend fetch flow is failing:
  - No XHR/fetch requests are being made from these pages.
  - Repeated ref warnings appear around animated/modal/sidebar components.

Most likely cause to fix:
- Frontend rendering/fetch lifecycle is unstable (not database/RLS), and the pages do not expose fetch failures clearly.
- Journey architecture is split (static data on `/journey`, DB data on `/interactive-journey`), which causes “admin updated but site didn’t change” confusion.

Implementation plan:
1) Stabilize data fetching and make failures visible (highest priority)
- `src/pages/InteractiveJourneyPage.tsx`
  - Replace current ad-hoc `useEffect` data loader with React Query (`useQuery`) for:
    - timeline events (active + timeline_visible)
    - paths + path_steps
  - Add explicit UI states:
    - loading state for map timeline
    - error banner with retry button
    - empty state only when query success + 0 rows
  - Add guarded logs (single concise `console.error`) when query fails.
- `src/pages/CharacterPage.tsx`
  - Convert current `useEffect` load to React Query as well.
  - Add same visible states: loading / error / empty.

2) Remove animation/ref instability causing noisy runtime warnings
- Update components used in animated + dialog contexts to be ref-safe:
  - `src/components/journey/EventsSidebar.tsx`
  - `src/components/EventDetailModal.tsx`
- For any custom component passed through animated/presence/dialog flows, ensure `forwardRef` where required (or avoid patterns that inject refs into plain function components).
- Keep behavior identical; this is a compatibility cleanup to prevent lifecycle side effects.

3) Make timeline data source consistent with admin updates
- `src/pages/JourneyPage.tsx`
  - Stop relying on static `timelineEvents` as primary source.
  - Load timeline list from backend (same filters as interactive journey).
  - Keep static file only as optional fallback if query errors (with visible notice), not as default source.
- Result: admin edits become visible consistently on Journey + Interactive Journey.

4) Hardening for user trust/debuggability
- Add lightweight fetch diagnostics:
  - Show row counts in dev console once per page load (events/traits loaded).
  - Keep user-facing text simple in Arabic/English (“Unable to load content. Try refresh.”) with retry action.
- Ensure all admin mutations continue invalidating React Query caches in admin pages.

5) Verification checklist after implementation
- As admin:
  - Edit one timeline event title + keep it active/visible.
  - Edit one shamail trait title + keep active.
- As public user:
  - `/interactive-journey`: confirm year 570 no longer shows 0; markers/events render.
  - `/journey`: edited timeline text appears after refresh.
  - `/character`: edited trait appears after refresh.
- Confirm browser network now includes backend fetch requests from those pages.
- Confirm ref warnings are removed or significantly reduced.

Scope note:
- No database migration is required for this fix (data + policies already correct).
- This is a frontend data-flow and rendering stability fix.
