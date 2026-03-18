

## Improving the Interactive Journey — Enhancement Plan

After reviewing the full Interactive Journey implementation (~860 lines), here's what's already built and what can be improved:

### What Already Exists
- Leaflet map with animated paths, glowing dots, category-colored markers
- Auto-play with speed presets (0.5x–3x)
- Audio narration with auto-narrate, volume, seek bar
- Events sidebar with thumbnails, categories, and "Read More"
- Event detail modal with related events
- Era indicator (Makkan/Madinan)
- Timeline slider with event tick marks

---

### Proposed Improvements

#### 1. Keyboard Shortcuts
Add hotkeys for power users:
- **Space** → Play/Pause
- **Arrow Left/Right** → Jump to previous/next event year
- **M** → Mute/Unmute
- **Escape** → Close sidebar
- **?** → Show shortcuts help overlay

#### 2. Mini Event Cards on Map (Popups)
When auto-play advances to a new year, show a brief animated popup card on the map at the event location (title + year + category icon) that fades after 3 seconds — giving context without requiring the sidebar.

#### 3. Event Category Filter
Add toggle chips above the timeline slider to filter visible events by category (milestone, battle, treaty, etc.). Already have category colors/icons defined.

#### 4. Progress Indicator
Show a visual indicator of how far through the Seerah journey the user has progressed (e.g., "Year 610 — 65% through the timeline") as a thin progress bar or percentage.

#### 5. Fullscreen Mode
Add a fullscreen toggle button so users can immerse themselves in the map experience without browser chrome.

#### 6. Mobile Responsiveness
The bottom control bar is currently dense with many controls on one row. On mobile, stack controls into two rows and make the sidebar full-width overlay.

#### 7. Year Labels on Major Events
Show floating year labels on the timeline slider at positions of major events (Birth, Revelation, Hijrah, Badr, Conquest of Makkah, etc.) so users can quickly jump to key moments.

---

### Technical Details

- **Keyboard shortcuts**: Single `useEffect` with `keydown` listener, check `e.key` and call existing handlers
- **Mini popups**: Use Leaflet `L.popup` with auto-close timeout, triggered in the year-change effect
- **Category filter**: New state `activeCategories: Set<string>`, filter `visibleEvents` through it
- **Progress bar**: Simple calculation `((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100`
- **Fullscreen**: Use `document.documentElement.requestFullscreen()` API
- **Mobile layout**: Tailwind responsive classes on the time-bar, `flex-wrap` and stacked layout below `md:`

