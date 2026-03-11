import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { categories, categoryMap } from "@/data/eventCategories";

interface GraphEvent {
  id: string;
  title: string;
  title_en: string;
  slug: string | null;
  year_ce: number;
  era: string;
  category: string;
  related_event_ids: string[];
}

interface Props {
  events: GraphEvent[];
  highlightEventId?: string;
  searchQuery?: string;
  compact?: boolean;
}

const categoryColors: Record<string, string> = {
  milestone: "hsl(46, 56%, 52%)",
  battle: "hsl(0, 72%, 50%)",
  contract: "hsl(200, 60%, 50%)",
  challenge: "hsl(30, 80%, 50%)",
  marriage: "hsl(330, 60%, 55%)",
  diplomacy: "hsl(160, 50%, 40%)",
};

interface GraphNode {
  id: string;
  x: number;
  y: number;
  title: string;
  titleAr: string;
  slug: string | null;
  year: number;
  era: string;
  category: string;
  radius: number;
  connections: number;
}

interface Edge {
  source: string;
  target: string;
}

interface Cluster {
  id: string;
  nodes: GraphNode[];
  hull: { x: number; y: number }[];
  centroid: { x: number; y: number };
  color: string;
  label: string;
}

// --- Convex Hull (Graham Scan) ---
function convexHull(points: { x: number; y: number }[]): { x: number; y: number }[] {
  if (points.length < 3) return points;
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (O: { x: number; y: number }, A: { x: number; y: number }, B: { x: number; y: number }) =>
    (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
  const lower: { x: number; y: number }[] = [];
  for (const p of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
  const upper: { x: number; y: number }[] = [];
  for (const p of pts.reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
  lower.pop(); upper.pop();
  return lower.concat(upper);
}

function expandHull(hull: { x: number; y: number }[], padding: number): { x: number; y: number }[] {
  const cx = hull.reduce((s, p) => s + p.x, 0) / hull.length;
  const cy = hull.reduce((s, p) => s + p.y, 0) / hull.length;
  return hull.map(p => {
    const dx = p.x - cx, dy = p.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: p.x + (dx / dist) * padding, y: p.y + (dy / dist) * padding };
  });
}

function smoothHullPath(hull: { x: number; y: number }[]): string {
  if (hull.length < 3) return "";
  const n = hull.length;
  const pts = [...hull, hull[0], hull[1]];
  let d = `M ${hull[0].x} ${hull[0].y}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d + " Z";
}

function computeClusters(nodes: GraphNode[], edges: Edge[], isAr: boolean): Cluster[] {
  const eraGroups = new Map<string, GraphNode[]>();
  nodes.forEach(n => {
    const group = eraGroups.get(n.era) || [];
    group.push(n);
    eraGroups.set(n.era, group);
  });

  const clusters: Cluster[] = [];

  eraGroups.forEach((eraNodes, era) => {
    const nodeIds = new Set(eraNodes.map(n => n.id));
    const adj = new Map<string, Set<string>>();
    eraNodes.forEach(n => adj.set(n.id, new Set()));
    edges.forEach(e => {
      if (nodeIds.has(e.source) && nodeIds.has(e.target)) {
        adj.get(e.source)?.add(e.target);
        adj.get(e.target)?.add(e.source);
      }
    });

    const visited = new Set<string>();
    const nodeById = new Map(eraNodes.map(n => [n.id, n]));

    eraNodes.forEach(startNode => {
      if (visited.has(startNode.id)) return;
      const component: GraphNode[] = [];
      const queue = [startNode.id];
      visited.add(startNode.id);
      while (queue.length) {
        const cur = queue.shift()!;
        component.push(nodeById.get(cur)!);
        adj.get(cur)?.forEach(nb => {
          if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
        });
      }

      if (component.length < 3) return;

      const points = component.map(n => ({ x: n.x, y: n.y }));
      const hull = expandHull(convexHull(points), 35);
      const cx = component.reduce((s, n) => s + n.x, 0) / component.length;
      const cy = component.reduce((s, n) => s + n.y, 0) / component.length;

      const catCount = new Map<string, number>();
      component.forEach(n => catCount.set(n.category, (catCount.get(n.category) || 0) + 1));
      const domCat = [...catCount.entries()].sort((a, b) => b[1] - a[1])[0][0];
      const color = categoryColors[domCat] || "hsl(160, 50%, 40%)";

      const years = component.map(n => n.year).sort((a, b) => a - b);
      const minY = years[0], maxY = years[years.length - 1];
      const yearStr = minY === maxY ? `${minY}` : `${minY}–${maxY}`;

      const catConfig = categoryMap[domCat as keyof typeof categoryMap];
      const catLabel = catConfig ? (isAr ? catConfig.label : catConfig.labelEn) : domCat;

      clusters.push({
        id: `${era}-${domCat}-${minY}`,
        nodes: component,
        hull,
        centroid: { x: cx, y: cy },
        color,
        label: `${catLabel} ${yearStr}`,
      });
    });
  });

  return clusters;
}

function computeLayout(events: GraphEvent[], width: number, height: number): { nodes: GraphNode[]; edges: Edge[] } {
}

function computeLayout(events: GraphEvent[], width: number, height: number): { nodes: Node[]; edges: Edge[] } {
  const eventMap = new Map(events.map((e) => [e.id, e]));
  const edges: Edge[] = [];
  const edgeSet = new Set<string>();

  events.forEach((e) => {
    (e.related_event_ids || []).forEach((rid) => {
      if (eventMap.has(rid)) {
        const key = [e.id, rid].sort().join("-");
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ source: e.id, target: rid });
        }
      }
    });
  });

  const connectedIds = new Set<string>();
  edges.forEach((e) => {
    connectedIds.add(e.source);
    connectedIds.add(e.target);
  });

  const connectedEvents = events.filter((e) => connectedIds.has(e.id));

  const connectionCount = new Map<string, number>();
  edges.forEach((e) => {
    connectionCount.set(e.source, (connectionCount.get(e.source) || 0) + 1);
    connectionCount.set(e.target, (connectionCount.get(e.target) || 0) + 1);
  });

  const sorted = [...connectedEvents].sort((a, b) => a.year_ce - b.year_ce);
  const minYear = sorted[0]?.year_ce || 570;
  const maxYear = sorted[sorted.length - 1]?.year_ce || 632;
  const yearRange = Math.max(maxYear - minYear, 1);

  const yearGroups = new Map<number, number>();
  sorted.forEach((e) => {
    yearGroups.set(e.year_ce, (yearGroups.get(e.year_ce) || 0) + 1);
  });
  const yearCounters = new Map<number, number>();

  const padding = 80;
  const nodes: Node[] = sorted.map((e) => {
    const yearFraction = (e.year_ce - minYear) / yearRange;
    const count = yearGroups.get(e.year_ce) || 1;
    const idx = yearCounters.get(e.year_ce) || 0;
    yearCounters.set(e.year_ce, idx + 1);

    const verticalSpread = count > 1 ? (idx / (count - 1) - 0.5) * (height - padding * 2) * 0.85 : 0;
    const conns = connectionCount.get(e.id) || 0;

    return {
      id: e.id,
      x: padding + yearFraction * (width - padding * 2) + (Math.random() - 0.5) * 50,
      y: height / 2 + verticalSpread + (Math.random() - 0.5) * 60,
      title: e.title_en,
      titleAr: e.title,
      slug: e.slug,
      year: e.year_ce,
      era: e.era,
      category: e.category,
      radius: Math.min(8 + conns * 2, 20),
      connections: conns,
    };
  });

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  for (let iter = 0; iter < 120; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const minDist = 90;
        if (dist < minDist) {
          const force = (minDist - dist) / dist * 0.5;
          nodes[i].x -= dx * force;
          nodes[i].y -= dy * force;
          nodes[j].x += dx * force;
          nodes[j].y += dy * force;
        }
      }
    }

    edges.forEach((edge) => {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) return;
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idealDist = 160;
      if (dist > idealDist) {
        const force = (dist - idealDist) / dist * 0.05;
        s.x += dx * force;
        s.y += dy * force;
        t.x -= dx * force;
        t.y -= dy * force;
      }
    });

    nodes.forEach((n) => {
      n.x = Math.max(padding, Math.min(width - padding, n.x));
      n.y = Math.max(padding, Math.min(height - padding, n.y));
    });
  }

  return { nodes, edges };
}

function bezierPath(sx: number, sy: number, tx: number, ty: number): string {
  const dx = tx - sx;
  const dy = ty - sy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offset = Math.min(dist * 0.25, 60);
  // perpendicular offset for curve
  const nx = -dy / dist * offset;
  const ny = dx / dist * offset;
  const cx = (sx + tx) / 2 + nx;
  const cy = (sy + ty) / 2 + ny;
  return `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
}

const EventRelationshipGraph = ({ events, highlightEventId, searchQuery = "", compact = false }: Props) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(compact ? 1 : 0.55);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [initialFitDone, setInitialFitDone] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{ screenX: number; screenY: number; node: Node } | null>(null);

  const graphWidth = compact ? 800 : 2400;
  const graphHeight = compact ? 500 : 1400;

  const { nodes, edges } = useMemo(
    () => computeLayout(events, graphWidth, graphHeight),
    [events, graphWidth, graphHeight]
  );

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // Search matches
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    return new Set(
      nodes.filter((n) =>
        n.title.toLowerCase().includes(q) || n.titleAr.includes(searchQuery)
      ).map((n) => n.id)
    );
  }, [searchQuery, nodes]);

  const hasSearch = searchMatches.size > 0;

  // Highlighted connections
  const highlightedEdges = useMemo(() => {
    const active = hoveredNode || highlightEventId;
    if (!active) return new Set<string>();
    const set = new Set<string>();
    edges.forEach((e) => {
      if (e.source === active || e.target === active) {
        set.add([e.source, e.target].sort().join("-"));
      }
    });
    return set;
  }, [hoveredNode, highlightEventId, edges]);

  const connectedToActive = useMemo(() => {
    const active = hoveredNode || highlightEventId;
    if (!active) return new Set<string>();
    const set = new Set<string>();
    set.add(active);
    edges.forEach((e) => {
      if (e.source === active) set.add(e.target);
      if (e.target === active) set.add(e.source);
    });
    return set;
  }, [hoveredNode, highlightEventId, edges]);

  const hasActive = (hoveredNode || highlightEventId) != null;

  // Timeline axis years
  const timelineYears = useMemo(() => {
    const years = [570, 580, 590, 600, 610, 615, 620, 622, 625, 628, 630, 632];
    if (nodes.length === 0) return [];
    const minYear = Math.min(...nodes.map((n) => n.year));
    const maxYear = Math.max(...nodes.map((n) => n.year));
    return years.filter((y) => y >= minYear && y <= maxYear);
  }, [nodes]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.3, Math.min(3, z + delta)));
  }, []);

  const handleNodeClick = useCallback((node: Node) => {
    const target = node.slug || node.id;
    navigate(`/event/${target}`);
  }, [navigate]);

  const handleNodeHover = useCallback((node: Node, e: React.MouseEvent) => {
    setHoveredNode(node.id);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        screenX: e.clientX - rect.left,
        screenY: e.clientY - rect.top - 10,
        node,
      });
    }
  }, []);

  const handleNodeLeave = useCallback(() => {
    setHoveredNode(null);
    setTooltip(null);
  }, []);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.3));
  const handleReset = useCallback(() => {
    if (!containerRef.current || nodes.length === 0) { setZoom(compact ? 1 : 0.55); setPan({ x: 0, y: 0 }); return; }
    const rect = containerRef.current.getBoundingClientRect();
    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const minX = Math.min(...xs) - 40;
    const maxX = Math.max(...xs) + 40;
    const minY = Math.min(...ys) - 40;
    const maxY = Math.max(...ys) + 40;
    const bw = maxX - minX;
    const bh = maxY - minY;
    const fitZoom = Math.min(rect.width / bw, rect.height / bh, 1.5) * 0.9;
    setZoom(fitZoom);
    setPan({ x: (rect.width - bw * fitZoom) / 2 - minX * fitZoom, y: (rect.height - bh * fitZoom) / 2 - minY * fitZoom });
  }, [nodes, compact]);

  // Auto-fit on initial load
  useEffect(() => {
    if (!initialFitDone && nodes.length > 0 && containerRef.current) {
      // Small delay to ensure container is rendered
      const timer = setTimeout(() => { handleReset(); setInitialFitDone(true); }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialFitDone, nodes, handleReset]);

  // Center on highlighted event or first search match
  useEffect(() => {
    const targetId = highlightEventId || (hasSearch ? [...searchMatches][0] : null);
    if (targetId && containerRef.current) {
      const node = nodeMap.get(targetId);
      if (node) {
        const rect = containerRef.current.getBoundingClientRect();
        setPan({
          x: rect.width / 2 - node.x * zoom,
          y: rect.height / 2 - node.y * zoom,
        });
      }
    }
  }, [highlightEventId, searchMatches, hasSearch, nodeMap, zoom]);

  if (nodes.length === 0) return (
    <div className="flex items-center justify-center h-[400px] text-muted-foreground font-body text-sm">
      {isAr ? "لا توجد أحداث مترابطة للعرض" : "No connected events to display"}
    </div>
  );

  // Compute year→x mapping for timeline axis
  const minYear = Math.min(...nodes.map((n) => n.year));
  const maxYear = Math.max(...nodes.map((n) => n.year));
  const yearRange = Math.max(maxYear - minYear, 1);
  const yearToX = (year: number) => 80 + ((year - minYear) / yearRange) * (graphWidth - 160);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Zoom Controls */}
      <div className="absolute top-3 end-3 z-20 flex gap-1.5">
        {[
          { action: handleZoomIn, icon: <ZoomIn size={16} /> },
          { action: handleZoomOut, icon: <ZoomOut size={16} /> },
          { action: handleReset, icon: <Maximize2 size={16} /> },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className="p-1.5 rounded-lg bg-card/90 border border-border hover:bg-muted transition-colors backdrop-blur-sm"
          >
            <span className="text-foreground">{btn.icon}</span>
          </button>
        ))}
      </div>

      {/* SVG Graph */}
      <div
        className={`overflow-hidden rounded-xl border border-border bg-gradient-to-r from-[hsl(30,20%,8%)] via-[hsl(160,30%,8%)] to-[hsl(200,30%,10%)] cursor-grab active:cursor-grabbing ${compact ? "h-[400px]" : "h-[600px]"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setIsPanning(false); handleNodeLeave(); }}
        onWheel={handleWheel}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          className="select-none"
        >
          <defs>
            {/* Glow filter */}
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="node-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Search pulse */}
            <filter id="search-pulse" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Edge gradients per category */}
            {Object.entries(categoryColors).map(([key, color]) => (
              <linearGradient key={key} id={`edge-grad-${key}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <stop offset="50%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Era background bands */}
            <rect x={0} y={0} width={graphWidth * 0.5} height={graphHeight} fill="hsl(30, 20%, 12%)" fillOpacity={0.15} rx={12} />
            <rect x={graphWidth * 0.5} y={0} width={graphWidth * 0.5} height={graphHeight} fill="hsl(200, 25%, 12%)" fillOpacity={0.15} rx={12} />

            {/* Era labels */}
            <text x={graphWidth * 0.25} y={30} textAnchor="middle" fill="hsl(30, 40%, 50%)" fontSize={11} fontWeight="600" opacity={0.4} className="select-none">
              {isAr ? "العهد المكي" : "MAKKAN PERIOD"}
            </text>
            <text x={graphWidth * 0.75} y={30} textAnchor="middle" fill="hsl(200, 40%, 50%)" fontSize={11} fontWeight="600" opacity={0.4} className="select-none">
              {isAr ? "العهد المدني" : "MADINAN PERIOD"}
            </text>

            {/* Timeline axis */}
            <line x1={80} y1={graphHeight - 30} x2={graphWidth - 80} y2={graphHeight - 30} stroke="hsl(0, 0%, 40%)" strokeWidth={0.5} opacity={0.3} />
            {timelineYears.map((year) => {
              const x = yearToX(year);
              return (
                <g key={year}>
                  <line x1={x} y1={graphHeight - 35} x2={x} y2={graphHeight - 25} stroke="hsl(0, 0%, 50%)" strokeWidth={0.5} opacity={0.4} />
                  <text x={x} y={graphHeight - 14} textAnchor="middle" fill="hsl(0, 0%, 55%)" fontSize={9} opacity={0.5} className="select-none">
                    {year}
                  </text>
                </g>
              );
            })}

            {/* Curved Edges */}
            {edges.map((edge) => {
              const s = nodeMap.get(edge.source);
              const t = nodeMap.get(edge.target);
              if (!s || !t) return null;
              const key = [edge.source, edge.target].sort().join("-");
              const isHighlighted = highlightedEdges.has(key);
              const opacity = hasActive ? (isHighlighted ? 0.85 : 0.06) : hasSearch ? 0.08 : 0.2;
              const sourceCategory = s.category;
              const pathD = bezierPath(s.x, s.y, t.x, t.y);
              const color = categoryColors[sourceCategory] || "hsl(160, 50%, 40%)";

              return (
                <g key={key}>
                  <path
                    id={`edge-path-${key}`}
                    d={pathD}
                    fill="none"
                    stroke={isHighlighted ? `url(#edge-grad-${sourceCategory})` : "hsl(160, 20%, 40%)"}
                    strokeWidth={isHighlighted ? 2.5 : 0.8}
                    opacity={opacity}
                    className="transition-all duration-300"
                    strokeLinecap="round"
                  />
                  {/* Particle trails on highlighted edges */}
                  {isHighlighted && (
                    <>
                      {[0, 0.33, 0.66].map((delay, i) => (
                        <circle key={i} r={3} fill={color} opacity={0}>
                          <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            begin={`${delay * 2}s`}
                            path={pathD}
                          />
                          <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.1;0.8;1" dur="2s" repeatCount="indefinite" begin={`${delay * 2}s`} />
                          <animate attributeName="r" values="1.5;3.5;1.5" dur="2s" repeatCount="indefinite" begin={`${delay * 2}s`} />
                        </circle>
                      ))}
                      {/* Faint glow trail */}
                      <circle r={6} fill={color} opacity={0} filter="url(#node-glow)">
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          path={pathD}
                        />
                        <animate attributeName="opacity" values="0;0.15;0.15;0" keyTimes="0;0.1;0.8;1" dur="3s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const color = categoryColors[node.category] || "hsl(160, 50%, 40%)";
              const isActive = node.id === (hoveredNode || highlightEventId);
              const isConnected = connectedToActive.has(node.id);
              const isSearchMatch = searchMatches.has(node.id);
              const showLabel = node.connections >= 3 || isActive || isSearchMatch;

              let opacity = 1;
              if (hasActive) opacity = isConnected ? 1 : 0.12;
              else if (hasSearch) opacity = isSearchMatch ? 1 : 0.15;

              const scale = isActive ? 1.5 : isSearchMatch ? 1.3 : 1;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  style={{ opacity, transition: "opacity 0.3s ease" }}
                  onMouseEnter={(e) => handleNodeHover(node, e)}
                  onMouseLeave={handleNodeLeave}
                  onClick={(e) => { e.stopPropagation(); handleNodeClick(node); }}
                >
                  {/* Search pulse ring */}
                  {isSearchMatch && (
                    <>
                      <circle cx={node.x} cy={node.y} r={node.radius * scale + 14} fill="none" stroke={color} strokeWidth={1.5} opacity={0.2}>
                        <animate attributeName="r" from={node.radius * scale + 8} to={node.radius * scale + 22} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={node.x} cy={node.y} r={node.radius * scale + 8} fill={color} fillOpacity={0.1} filter="url(#search-pulse)" />
                    </>
                  )}

                  {/* Outer glow for active */}
                  {isActive && (
                    <circle cx={node.x} cy={node.y} r={node.radius * scale + 10} fill={color} fillOpacity={0.15} filter="url(#node-glow-strong)" />
                  )}

                  {/* Glow ring */}
                  {(isActive || isSearchMatch) && (
                    <circle
                      cx={node.x} cy={node.y}
                      r={node.radius * scale + 5}
                      fill="none"
                      stroke={color}
                      strokeWidth={1.5}
                      opacity={0.5}
                    />
                  )}

                  {/* Node circle */}
                  <circle
                    cx={node.x} cy={node.y}
                    r={node.radius * scale}
                    fill={color}
                    stroke="hsl(0, 0%, 90%)"
                    strokeWidth={1}
                    filter={isActive ? "url(#node-glow)" : undefined}
                  />

                  {/* Year inside node */}
                  {node.radius >= 10 && (
                    <text
                      x={node.x} y={node.y + 3}
                      textAnchor="middle" fill="white" fontSize={7} fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {node.year}
                    </text>
                  )}

                  {/* Persistent label for highly connected nodes */}
                  {showLabel && (
                    <text
                      x={node.x}
                      y={node.y - node.radius * scale - 8}
                      textAnchor="middle"
                      fill="hsl(60, 33%, 90%)"
                      fontSize={9}
                      fontWeight="500"
                      className="pointer-events-none select-none"
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                    >
                      {(isAr ? node.titleAr : node.title).slice(0, 25)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* HTML Tooltip Overlay */}
      {tooltip && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            left: tooltip.screenX,
            top: tooltip.screenY,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl px-4 py-3 shadow-xl min-w-[200px] max-w-[280px]">
            <p className="font-serif-display text-sm text-foreground leading-snug mb-1">
              {isAr ? tooltip.node.titleAr : tooltip.node.title}
            </p>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: categoryColors[tooltip.node.category] }}
              />
              <span className="text-[10px] font-body text-muted-foreground capitalize">
                {categoryMap[tooltip.node.category as keyof typeof categoryMap]
                  ? (isAr
                    ? categoryMap[tooltip.node.category as keyof typeof categoryMap].label
                    : categoryMap[tooltip.node.category as keyof typeof categoryMap].labelEn)
                  : tooltip.node.category}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-body text-secondary font-semibold">
                {tooltip.node.year} {isAr ? "م" : "CE"}
              </span>
              <span className="text-[10px] font-body text-muted-foreground">
                {tooltip.node.connections} {isAr ? "روابط" : "connections"}
              </span>
            </div>
            <p className="text-[9px] font-body text-muted-foreground/60 mt-1.5 border-t border-border/50 pt-1">
              {isAr ? "اضغط للتفاصيل" : "Click to view details →"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRelationshipGraph;
