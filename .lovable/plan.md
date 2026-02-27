

## Multi-Path Interactive Map System — Plan

This is a large feature set. Following the agreed "frontend first, then Cloud" strategy, I'll split this into two phases.

---

### Phase 1: Frontend Multi-Path System (this implementation)

**1. Create path data file** (`src/data/mapPaths.ts`)
- Define `PathStep` interface (step order, location ID or custom coords, optional event link)
- Define `MapPath` interface (id, name/nameEn, description/descriptionEn, lineColor, pathType: "land" | "sea", steps array)
- Pre-populate 3 paths:
  - **The Hijrah** (Makkah → Cave Thawr → Quba → Madinah) — replaces current `hijrahRoute`
  - **Journey to Ta'if** (Makkah → Ta'if → return)
  - **Migration to Abyssinia** (Makkah → Red Sea coast → Abyssinia) — dashed line for sea segments

**2. Add new map locations** for path completeness
- Add **Cave Thawr** and **Quba** to `mapLocations.ts` with coordinates

**3. Build Path Selector sidebar** (`src/components/MapPathSelector.tsx`)
- Collapsible panel listing all paths with colored indicators
- Single-select: clicking a path highlights it on the map
- Shows path description and step count
- "Play Path" cinematic button per path

**4. Update `ArabianMapSVG.tsx`** for multi-path rendering
- Remove hardcoded `hijrahRoute`; accept `activePath` prop
- Draw animated SVG path for the selected journey
- Dashed stroke for sea segments, solid for land
- Animate path drawing with CSS `stroke-dashoffset` transition
- Show step numbers along the path

**5. Build Step Navigation** (`src/components/MapStepNavigator.tsx`)
- "Next" / "Previous" buttons when a path is active
- Current step indicator (e.g., "Step 2 of 4")
- Clicking a step highlights the location and shows its card
- Smooth visual transition between steps (pulse animation on active marker)

**6. Cinematic "Play Path" mode**
- Auto-advances through steps with 5-second pause at each
- Shows location card with description at each stop
- Progress bar showing journey completion
- Play/Pause/Stop controls
- Smooth ease-in-out transitions between steps

**7. Update `MapPage.tsx`**
- Replace single route toggle with path selector sidebar
- Integrate step navigator and cinematic controls
- Keep existing category filter working alongside paths

---

### Phase 2: Cloud + Admin (future, not in this implementation)
- Supabase `paths` and `path_steps` tables
- Admin Path Builder with drag-and-drop step sequencer
- Coordinate picker on map
- CSV bulk upload
- Database-driven rendering

---

### Technical Notes
- The current SVG viewBox is `0 0 100 100` with percentage-based coordinates — new locations and path coords will use the same system
- Category icons on path steps will reuse existing `categoryIconPaths` from `ArabianMapSVG`
- Cinematic mode uses `setInterval` + state management, no external libraries needed
- Sea vs land path distinction uses the `pathType` field per path segment

