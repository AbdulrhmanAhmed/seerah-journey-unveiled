

# Journey Page: Show All Events with Toggle

## Problem
The Journey page currently uses only 23 hardcoded events from `seerahTimeline.ts`, while the database has **244 active events**. Users see far more events on the Interactive Map and want the same richness on the Journey timeline.

## Solution
Fetch events from the database instead of static data, and add a toggle so users can switch between "Important Events" (major only) and "All Events."

## Plan

### 1. Fetch events from database
- Replace the static `timelineEvents` import with a `useQuery` call to `timeline_events` table
- Fetch all active events ordered by `year_ce` and `display_order`
- Map database fields to the component's expected shape

### 2. Add toggle UI
- Add a pill-style toggle at the top of the timeline (below the header) with two options: "Important Events" / "All Events"
- Default to "Important Events" (`is_major = true`, ~133 events)
- "All Events" shows all 244 events
- Add translation keys for the toggle labels in both Arabic and English

### 3. Update event rendering
- Filter fetched events by `is_major` flag based on toggle state
- Split into Makkah/Madinah sections using the `era` field (same as current logic)
- Map DB fields (`title`/`title_en`, `description`/`description_en`, `year_hijri`, `year_ce`, `category`, `era`) to card props

### 4. Update TimelineEventCard
- Adapt it to accept the database event shape (or map at the page level)
- Navigation to `/event/{slug || id}` on "Learn More"

### 5. Add loading state
- Show skeleton cards while data loads

### Files to modify
- `src/pages/JourneyPage.tsx` — main changes (DB fetch, toggle, mapping)
- `src/i18n/translations.ts` — add toggle label translations
- `src/components/TimelineEventCard.tsx` — minor adaptation if needed

