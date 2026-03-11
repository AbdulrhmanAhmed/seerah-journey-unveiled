

## Enhanced Event Network — Cluster Grouping & Mini-map

### 1. Cluster Grouping by Era/Theme

**What**: Draw semi-transparent convex hull boundaries around groups of related nodes, with subtle labels. Clusters will be computed by detecting densely connected sub-graphs (connected components within each era+category combination).

**How** — in `EventRelationshipGraph.tsx`:
- After `computeLayout`, compute clusters by grouping nodes that share edges AND the same era (makkah/madinah). If a cluster has 3+ nodes, compute a convex hull polygon.
- Render each cluster as a `<path>` with rounded corners (using curve interpolation), filled with the dominant category color at ~8% opacity, with a dashed border at ~15% opacity.
- Add a small cluster label (e.g., "Badr Campaign", "Meccan Persecution") positioned at the centroid of each cluster, using `fontSize={10}` with low opacity.
- Clusters render behind edges/nodes in the SVG layer order.

**Cluster detection logic**:
- Group connected nodes by era → for each era, run connected-component analysis on the sub-graph → clusters with 3+ nodes get a hull
- Label each cluster based on the most common category + year range (e.g., "Battles 624-627")

### 2. Mini-map Navigator

**What**: A small (150x100px) overview rectangle in the bottom-left corner showing all nodes as tiny dots, with a viewport rectangle indicating the current visible area.

**How** — in `EventRelationshipGraph.tsx`:
- Add a `<div>` overlay positioned `absolute bottom-3 start-3` with a small `<svg>` inside.
- Render all nodes as 2px dots (colored by category) scaled to fit the mini-map dimensions.
- Compute the current viewport rectangle from `pan`, `zoom`, and container dimensions, and draw it as a semi-transparent bordered rect.
- Clicking/dragging on the mini-map updates `pan` to navigate the main view.
- Add a subtle border and dark background with backdrop blur.

### Files to Modify
- `src/components/EventRelationshipGraph.tsx` — Add cluster hull computation + rendering, add mini-map overlay component

### Technical Notes
- Convex hull via Graham scan (simple ~30-line algorithm, no dependencies needed)
- Hull paths smoothed with `catmull-rom` → SVG cubic bezier conversion for organic shapes
- Mini-map viewport rect computed as: `viewportX = -pan.x / zoom`, `viewportY = -pan.y / zoom`, scaled to mini-map coordinates

