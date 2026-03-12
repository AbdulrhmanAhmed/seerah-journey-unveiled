

## Animated Travel Paths for Interactive Journey

### What
Replace the static polylines with animated travel paths that show a glowing dot tracing the Prophet's ﷺ journeys along the route. When a path becomes active (its events are in the visible year range), the line draws itself progressively and a moving dot travels along it — creating a cinematic "journey unfolding" effect.

### Changes — `src/pages/InteractiveJourneyPage.tsx`

**1. Animated path drawing (progressive reveal)**
- Instead of rendering the full polyline at once, use Leaflet's `L.polyline` with a CSS `stroke-dashoffset` animation to create a "drawing" effect when a path first appears.
- Create a helper function `animatePolyline(polyline)` that sets `dashArray` to the total path length and animates `dashOffset` from full length to 0 over ~2 seconds using `requestAnimationFrame`.

**2. Moving dot along the path**
- For each active path, add a `L.circleMarker` (radius 6, glowing gold) that moves along the polyline's coordinates using interpolation.
- Use `requestAnimationFrame` to smoothly animate the dot position between path step coordinates over ~3 seconds (looping).
- Add a CSS glow effect (`box-shadow`) to the moving dot marker via a custom `L.divIcon`.

**3. Trail effect behind the moving dot**
- Add a secondary semi-transparent polyline (weight 8, lower opacity) that follows behind the dot, creating a fading "comet trail" effect using gradient opacity.

**4. Path label popup**
- When the animated dot completes one loop, briefly show the path name (e.g., "الهجرة / The Hijrah") as a tooltip near the midpoint of the path.

**5. Integration with autoplay**
- During auto-play mode, when the year changes and a new path becomes active, trigger the draw animation automatically — so viewers see the journey unfold as the timeline progresses.

### Implementation Details

- **Animation engine**: Pure `requestAnimationFrame` loop with a `pathAnimationsRef` to track active animations and clean them up when paths change.
- **Interpolation**: Linear interpolation between consecutive path step lat/lng pairs, with speed proportional to segment distance for consistent visual speed.
- **Cleanup**: Clear all animation frames and remove animated markers/polylines in the existing `markersLayer.clearLayers()` block when the year changes.
- **Performance**: Maximum 3-4 simultaneous animated paths; animations auto-pause when the tab is not visible.

### Files to Modify
- `src/pages/InteractiveJourneyPage.tsx` — Add animation logic in the marker/polyline update `useEffect`, add animated dot layer, add CSS for glow effect

