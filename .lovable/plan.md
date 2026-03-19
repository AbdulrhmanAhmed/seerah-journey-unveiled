

## Fix Plan: Interactive Journey — Overlapping Markers, Arabic Labels, and Confusing Lines

### Problems Identified

1. **Overlapping markers**: 227 events share the exact same Makkah coordinates (21.4225, 39.8262), plus 3 in Madinah and 2 at other locations. Markers stack directly on top of each other.

2. **Arabic road/place names in English mode**: The CARTO label tile layer (`light_only_labels`) pulls from OpenStreetMap, which uses Arabic names for the Arabian Peninsula region. There's no language parameter for these tiles.

3. **Confusing connecting lines**: The "universal journey line" connects all non-path events chronologically, creating zigzag lines between events at the same location or unrelated events.

---

### Solution

#### 1. Marker Clustering with Leaflet.markercluster
- Add `leaflet.markercluster` package
- Replace the plain `L.layerGroup` for markers with `L.markerClusterGroup` configured with custom styling matching the app's gold/sepia theme
- Clusters will show count badges and expand on click, solving the 227-marker-on-Makkah problem
- When clicking a cluster, show the events sidebar with all events at that location

#### 2. Switch to English Map Labels
- Replace the CARTO `light_only_labels` layer with a language-aware tile source
- Use CARTO's vector/query endpoint or switch to a labels-only layer that respects `lang` parameter
- Option A: Use `https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png?language=en` (CARTO supports `@2x` and language parameter on some endpoints)
- Option B: Remove the labels overlay entirely and use `light_all` with language parameter
- Dynamically switch between Arabic and English labels based on `lang` state

#### 3. Simplify Journey Lines
- Remove the "universal animated path" that connects all non-path events (the zigzag line)
- Only show the actual defined paths (Hijrah, Ta'if, Abyssinia) which have proper geographic steps
- This eliminates the confusing lines between events at the same coordinates

---

### Files to Modify

**`src/pages/InteractiveJourneyPage.tsx`**:
- Import and configure `L.markerClusterGroup` instead of `L.layerGroup` for markers
- Update the tile layer URL to include language parameter based on `lang`
- Remove the universal journey line logic (lines ~413-428) that creates the confusing connections
- Add custom cluster icon styling

**`package.json`**:
- Add `leaflet.markercluster` dependency

---

### Technical Details

```text
Current marker rendering flow:
  visibleEvents → forEach → L.marker → addTo(markersLayer)
  
New flow with clustering:
  visibleEvents → forEach → L.marker → addTo(markerClusterGroup)
  markerClusterGroup handles overlap automatically

Tile layers (language-aware):
  Arabic: light_only_labels (default OSM)
  English: Use Stamen/MapTiler labels or remove labels overlay

Lines to remove (universal journey path):
  Lines ~413-428: sortedVisible → journeyPositions → animatePathLine
  Keep only: activePaths.forEach (defined paths like Hijrah, Ta'if, Abyssinia)
```

