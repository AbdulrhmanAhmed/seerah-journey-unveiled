

## Issues Identified

1. **No Navbar**: InteractiveJourneyPage is rendered without the `Layout` wrapper (line 41 of App.tsx), so no Navbar appears.
2. **Map zooms into events**: Lines 257-263 zoom the viewBox to the major event's coordinates, making the map too zoomed in. User wants the full map always visible.
3. **Too many markers on map**: `visibleEvents` shows ALL events up to `currentYear`, so by the end there are 255 dots. During auto-play, only the last ~3 events should be visible on the map.
4. **All 255 events have `timeline_visible=true`** — the query fetches all of them correctly, but they all pile up on the map.

## Plan

### 1. Add Navbar to InteractiveJourneyPage
- In `App.tsx`, wrap `InteractiveJourneyPage` with `<Layout>` (same as other routes)
- Adjust the page's layout to account for navbar height (add `pt-16` or similar top padding)

### 2. Remove event-based zoom — keep full map view
- Delete the `useEffect` at lines 257-263 that sets viewBox based on `majorEvent`
- Keep only the era-based viewBox (lines 248-254) which shows the broader region

### 3. Limit visible markers on map
- Change `visibleEvents` logic: during auto-play OR in general, only show events from the **current year** plus the **last 2-3 previous event-years** on the map (not all historical events)
- This keeps the map clean with only ~3-5 recent markers visible at any time
- The floating preview card continues to show the current year's major event

### 4. Adjust page container
- Change from `min-h-screen` to account for the navbar, using `calc(100vh - 5rem)` or flex layout within the Layout wrapper

