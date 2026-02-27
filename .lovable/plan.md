

## Grand Seerah Canvas — Implementation Plan

This is a large vision. I'll break it into focused, sequential phases to deliver incrementally.

---

### Phase 1: Zoomable Map Canvas

**Install** `react-zoom-pan-pinch` and wrap the existing SVG map inside a `TransformWrapper` / `TransformComponent`.

**Changes:**
- `MapPage.tsx`: Wrap the map container with zoom/pan controls, add zoom buttons (+/−/reset)
- `ArabianMapSVG.tsx`: Expand viewBox from `0 0 100 100` to `0 0 200 150` to cover a larger region (Abyssinia south to Jerusalem/Rome north). Add more geographic detail — coastlines, terrain shading, subtle animated clouds via CSS
- Add parchment texture background and gold-foil decorative borders via CSS/SVG
- Add subtle CSS cloud animation overlay

### Phase 2: Database — Media Fields

**Migration** to add media columns:

```text
map_locations:
  + image_url (text, nullable)
  + gallery_urls (jsonb, default '[]')
  + audio_url (text, nullable)

path_steps:
  + image_url (text, nullable)
  + audio_url (text, nullable)
  + custom_note (text, nullable)
  + custom_note_en (text, nullable)
```

**Storage bucket** `seerah-media` for image/audio uploads.

### Phase 3: Media-Rich Event UI

- `LocationCard.tsx`: Redesign as a full modal with:
  - Header image from `image_url`
  - Context gallery thumbnails from `gallery_urls`
  - "Listen" button for `audio_url` playback
- `ArabianMapSVG.tsx`: On hover over a marker, show a small polaroid-style image preview tooltip above the dot
- Bounce animation on markers using CSS keyframes (no external library needed)

### Phase 4: Path-Focus Mode Enhancement

- When path is selected: fade non-path events to 0 opacity (already done), add shimmering gold effect on path line via SVG animation
- **Sequence Bar**: New `PathSequenceBar` component at bottom — horizontal scrollable strip of event thumbnails with step numbers
- **Auto-Travel**: Enhance cinematic mode so the map auto-pans/zooms to each step using `react-zoom-pan-pinch`'s `zoomToElement` API, then shows the card, waits 5s, moves to next

### Phase 5: Admin Media & Path Editor

- `AdminLocationsPage.tsx`: Add image URL paste field + file upload to storage bucket for `image_url`, `gallery_urls`, `audio_url`
- `AdminPathsPage.tsx`: Add `custom_note` / `custom_note_en` fields per step, add image URL field per step
- **Visual Path Editor**: Mini map preview in admin where clicking assigns coordinates

### Phase 6: Connect Public Map to Database

- Replace static `mapLocations` and `mapPaths` imports with database queries via TanStack Query
- Filter by `is_active = true`
- All existing rendering logic stays — only data source changes

---

### Technical Details

**Dependencies to add:** `react-zoom-pan-pinch`

**Files to create:**
- `src/components/PathSequenceBar.tsx` — thumbnail strip for active path
- `src/components/MapHoverPreview.tsx` — polaroid tooltip on hover

**Files to modify:**
- `src/pages/MapPage.tsx` — zoom wrapper, sequence bar integration
- `src/components/ArabianMapSVG.tsx` — expanded geography, hover previews, gold shimmer path, bounce markers
- `src/components/LocationCard.tsx` — media-rich modal redesign
- `src/components/MapStepNavigator.tsx` — integrate with zoom API
- `src/pages/AdminPathsPage.tsx` — media fields, custom notes
- `src/pages/AdminLocationsPage.tsx` — image upload, gallery, audio
- 1 database migration for new columns + storage bucket

**Execution order:** Phase 1 → 2 → 6 → 3 → 4 → 5 (database and zoom first, then UI enhancements)

