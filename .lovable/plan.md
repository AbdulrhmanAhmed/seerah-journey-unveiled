

## Fix Interactive Journey Map: Spacing, Labels, and Smooth Transitions

### Problems Identified

1. **Events clustered too closely** — Many events share the same default coordinates (21.4225, 39.8262 for Makkah) because they happened in the same city. The marker cluster group (`maxClusterRadius: 40`) tries to handle this but at certain zoom levels they overlap badly.

2. **No persistent labels on markers** — Events only show titles on hover (via `bindTooltip`). There are no visible labels so you can't tell what each marker represents without hovering.

3. **Jerky transitions between events** — When autoplay moves to a new year, `flyToBounds` jumps to fit all events of that year. If consecutive years are in the same area, it barely moves; if they're far apart, it jumps abruptly. No smooth cinematic panning.

---

### Plan

#### 1. Spread overlapping markers with spatial offset
- For events sharing the same lat/lng (same city), apply a small radial offset (spiral pattern) so markers don't stack directly on top of each other
- Group events by location, then spread them in a circle around the true coordinates (radius ~0.02°, roughly 2km)
- This preserves geographic accuracy while making individual markers distinguishable

#### 2. Add persistent labels to markers
- Use Leaflet's `bindTooltip` with `permanent: true` instead of hover-only tooltips
- Show a short truncated title (max ~20 chars) as a permanent label above each marker
- Style labels with a small semi-transparent background so they don't clutter the map
- Only show permanent labels for current-year events; older events keep hover-only tooltips

#### 3. Smooth cinematic transitions between events
- Replace `flyToBounds` with `flyTo` targeting the centroid of new events, using longer duration (1.5-2s) and easing
- When consecutive events are in the same area, skip the fly animation to avoid jittery micro-movements
- Add a minimum distance threshold (~50km) before triggering a fly animation
- During autoplay, pan smoothly to each new event's location instead of abruptly fitting bounds

### Technical Details

**File**: `src/pages/InteractiveJourneyPage.tsx`

- **Offset logic**: Before adding markers, group `visibleEvents` by rounded lat/lng. For groups with 2+ events, distribute them in a spiral pattern around the center point.

- **Permanent tooltips**: Change `marker.bindTooltip(title, { direction: "top" })` to include `permanent: true` for current-year events, with CSS class for smaller font and background styling.

- **Smooth fly**: Replace the `flyToBounds` block (lines 460-465) with centroid-based `flyTo` that checks distance from current map center. If distance < threshold, use `panTo` with animation; if large distance, use `flyTo` with 2s duration.

- **CSS additions**: Add styles for permanent tooltip labels (`.seerah-permanent-label`) in `index.css`.

