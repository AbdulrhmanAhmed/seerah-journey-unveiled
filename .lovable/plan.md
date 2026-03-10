

## Fix Node Clustering — Better Spacing in Event Network

### Problem
Nodes are packed too tightly together, especially in dense year ranges (610–632 CE). The current layout uses a small canvas (1400×800), weak repulsion (minDist=50, 60 iterations), and insufficient vertical spread.

### Changes — `src/components/EventRelationshipGraph.tsx`

**1. Expand canvas size**
- Increase `graphWidth` from 1400 → 2400 and `graphHeight` from 800 → 1400 (non-compact)
- Set initial zoom to ~0.6 so the full graph fits in view, but users can zoom in for detail

**2. Stronger force-directed layout**
- Increase repulsion `minDist` from 50 → 90
- Increase repulsion force multiplier from 0.3 → 0.5
- Increase iterations from 60 → 120 for better convergence
- Increase edge `idealDist` from 100 → 160

**3. Better initial positioning**
- Increase vertical spread multiplier from 0.6 → 0.85 so same-year events spread more
- Increase random jitter from ±30/±40 to ±50/±60 for better initial separation

**4. Auto-fit on load**
- After layout, compute bounding box of all nodes and auto-set initial pan/zoom to fit all nodes with padding

### Result
Nodes will be well-separated with clear gaps between them, while the zoom-to-fit ensures the full graph is visible on load. Users can still zoom in to inspect dense areas.

