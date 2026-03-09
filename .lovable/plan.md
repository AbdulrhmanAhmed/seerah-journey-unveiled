

## Enhanced Event Network — Plan

### Current State
The graph is a basic SVG force-directed layout with simple circles, straight lines, zoom/pan, and a small tooltip. It works but feels flat and lacks interactivity depth.

### Enhancements

**1. Category Filter Toggles**
- Add clickable category filter buttons (milestone, battle, contract, challenge, marriage, diplomacy) above the graph
- Users can show/hide categories to focus on specific event types
- Animated transitions when filtering

**2. Search & Highlight**
- Add a search input to find events by name — matching nodes pulse/highlight and the view auto-centers on them

**3. Era Toggle (Makkan / Madinan / All)**
- Tab-style toggle to filter by era, with smooth transition

**4. Improved Visual Design**
- Curved edges (quadratic bezier) instead of straight lines for a more organic feel
- Animated gradient edges that pulse when highlighted
- Subtle particle/glow effect on hovered nodes using SVG filters (drop-shadow, blur)
- Node labels visible for highly-connected nodes (≥3 connections) without hover
- Era-based background gradient bands (left = Makkan warm tones, right = Madinan cool tones)

**5. Better Tooltip**
- Replace SVG tooltip with an HTML overlay tooltip (richer styling, supports Arabic text properly)
- Show: event title, year, category badge, connection count, "Click to view" hint

**6. Wheel Zoom**
- Add mouse wheel zoom support for smoother navigation

**7. Timeline Axis**
- Add a subtle year axis along the bottom of the graph showing key years (570, 610, 622, 632) as reference markers

### Files to Modify
- `src/components/EventRelationshipGraph.tsx` — Major rewrite: curved edges, SVG filters, HTML tooltip, wheel zoom, visible labels, timeline axis
- `src/pages/EventGraphPage.tsx` — Add search input, category filters, era toggle; pass filter state to graph component

### Technical Approach
- All filtering happens at the page level, passing filtered events to the graph
- HTML tooltip via a positioned `div` overlay (not SVG `<text>`)
- Bezier curves computed from node positions with a perpendicular offset
- SVG `<defs>` for glow/blur filters
- Wheel zoom via `onWheel` handler on the container

