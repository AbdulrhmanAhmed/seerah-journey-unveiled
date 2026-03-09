import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

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

interface Node {
  id: string;
  x: number;
  y: number;
  title: string;
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

// Force-directed layout (simple spring simulation)
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

  // Only include events that have at least one connection
  const connectedIds = new Set<string>();
  edges.forEach((e) => {
    connectedIds.add(e.source);
    connectedIds.add(e.target);
  });

  const connectedEvents = events.filter((e) => connectedIds.has(e.id));

  // Connection count per node
  const connectionCount = new Map<string, number>();
  edges.forEach((e) => {
    connectionCount.set(e.source, (connectionCount.get(e.source) || 0) + 1);
    connectionCount.set(e.target, (connectionCount.get(e.target) || 0) + 1);
  });

  // Initial positions: chronological layout with some spread
  const sorted = [...connectedEvents].sort((a, b) => a.year_ce - b.year_ce);
  const minYear = sorted[0]?.year_ce || 570;
  const maxYear = sorted[sorted.length - 1]?.year_ce || 632;
  const yearRange = Math.max(maxYear - minYear, 1);

  // Group by year for vertical spread
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

    const verticalSpread = count > 1 ? (idx / (count - 1) - 0.5) * (height - padding * 2) * 0.6 : 0;
    const conns = connectionCount.get(e.id) || 0;

    return {
      id: e.id,
      x: padding + yearFraction * (width - padding * 2) + (Math.random() - 0.5) * 30,
      y: height / 2 + verticalSpread + (Math.random() - 0.5) * 40,
      title: e.title_en,
      slug: e.slug,
      year: e.year_ce,
      era: e.era,
      category: e.category,
      radius: Math.min(8 + conns * 2, 20),
      connections: conns,
    };
  });

  // Simple force simulation (few iterations for performance)
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  for (let iter = 0; iter < 60; iter++) {
    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const minDist = 50;
        if (dist < minDist) {
          const force = (minDist - dist) / dist * 0.3;
          nodes[i].x -= dx * force;
          nodes[i].y -= dy * force;
          nodes[j].x += dx * force;
          nodes[j].y += dy * force;
        }
      }
    }

    // Attraction along edges
    edges.forEach((edge) => {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) return;
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idealDist = 100;
      if (dist > idealDist) {
        const force = (dist - idealDist) / dist * 0.05;
        s.x += dx * force;
        s.y += dy * force;
        t.x -= dx * force;
        t.y -= dy * force;
      }
    });

    // Keep in bounds
    nodes.forEach((n) => {
      n.x = Math.max(padding, Math.min(width - padding, n.x));
      n.y = Math.max(padding, Math.min(height - padding, n.y));
    });
  }

  return { nodes, edges };
}

const EventRelationshipGraph = ({ events, highlightEventId, compact = false }: Props) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: Node } | null>(null);

  const graphWidth = compact ? 800 : 1400;
  const graphHeight = compact ? 500 : 800;

  const { nodes, edges } = useMemo(
    () => computeLayout(events, graphWidth, graphHeight),
    [events, graphWidth, graphHeight]
  );

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

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

  const handleNodeClick = useCallback((node: Node) => {
    const target = node.slug || node.id;
    navigate(`/event/${target}`);
  }, [navigate]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.3));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // Center on highlighted event
  useEffect(() => {
    if (highlightEventId && containerRef.current) {
      const node = nodeMap.get(highlightEventId);
      if (node) {
        const rect = containerRef.current.getBoundingClientRect();
        setPan({
          x: rect.width / 2 - node.x * zoom,
          y: rect.height / 2 - node.y * zoom,
        });
      }
    }
  }, [highlightEventId, nodeMap, zoom]);

  if (nodes.length === 0) return null;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Controls */}
      <div className="absolute top-3 end-3 z-20 flex gap-1.5">
        <button onClick={handleZoomIn} className="p-1.5 rounded-lg bg-card/90 border border-border hover:bg-muted transition-colors backdrop-blur-sm">
          <ZoomIn size={16} className="text-foreground" />
        </button>
        <button onClick={handleZoomOut} className="p-1.5 rounded-lg bg-card/90 border border-border hover:bg-muted transition-colors backdrop-blur-sm">
          <ZoomOut size={16} className="text-foreground" />
        </button>
        <button onClick={handleReset} className="p-1.5 rounded-lg bg-card/90 border border-border hover:bg-muted transition-colors backdrop-blur-sm">
          <Maximize2 size={16} className="text-foreground" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-3 start-3 z-20 flex flex-wrap gap-2 max-w-[200px]">
        {Object.entries(categoryColors).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5 text-[10px] font-body text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="capitalize">{key}</span>
          </div>
        ))}
      </div>

      {/* SVG Graph */}
      <div
        className={`overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm cursor-grab active:cursor-grabbing ${compact ? "h-[400px]" : "h-[600px]"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setIsPanning(false); setHoveredNode(null); setTooltip(null); }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          className="select-none"
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {edges.map((edge) => {
              const s = nodeMap.get(edge.source);
              const t = nodeMap.get(edge.target);
              if (!s || !t) return null;
              const key = [edge.source, edge.target].sort().join("-");
              const isHighlighted = highlightedEdges.has(key);
              const opacity = hasActive ? (isHighlighted ? 0.8 : 0.08) : 0.25;

              return (
                <line
                  key={key}
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={isHighlighted ? "hsl(46, 56%, 52%)" : "hsl(160, 30%, 50%)"}
                  strokeWidth={isHighlighted ? 2.5 : 1}
                  opacity={opacity}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const color = categoryColors[node.category] || "hsl(160, 50%, 40%)";
              const isActive = node.id === (hoveredNode || highlightEventId);
              const isConnected = connectedToActive.has(node.id);
              const opacity = hasActive ? (isConnected ? 1 : 0.15) : 1;
              const scale = isActive ? 1.4 : 1;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-all duration-200"
                  style={{ opacity }}
                  onMouseEnter={() => {
                    setHoveredNode(node.id);
                    setTooltip({ x: node.x, y: node.y - node.radius - 10, node });
                  }}
                  onMouseLeave={() => {
                    setHoveredNode(null);
                    setTooltip(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(node);
                  }}
                >
                  {/* Glow ring */}
                  {isActive && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius * scale + 6}
                      fill="none"
                      stroke={color}
                      strokeWidth={2}
                      opacity={0.4}
                    />
                  )}

                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius * scale}
                    fill={color}
                    stroke="hsl(0, 0%, 100%)"
                    strokeWidth={1.5}
                    className="drop-shadow-sm"
                  />

                  {/* Year label */}
                  {node.radius >= 10 && (
                    <text
                      x={node.x}
                      y={node.y + 3}
                      textAnchor="middle"
                      fill="white"
                      fontSize={8}
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {node.year}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Tooltip */}
            {tooltip && (
              <g className="pointer-events-none">
                <rect
                  x={tooltip.x - 90}
                  y={tooltip.y - 40}
                  width={180}
                  height={36}
                  rx={8}
                  fill="hsl(160, 70%, 10%)"
                  fillOpacity={0.92}
                  stroke="hsl(46, 56%, 52%)"
                  strokeWidth={1}
                />
                <text
                  x={tooltip.x}
                  y={tooltip.y - 25}
                  textAnchor="middle"
                  fill="hsl(60, 33%, 97%)"
                  fontSize={10}
                  fontWeight="500"
                  className="select-none"
                >
                  {(isAr ? events.find(e => e.id === tooltip.node.id)?.title : tooltip.node.title)?.slice(0, 30) || ""}
                </text>
                <text
                  x={tooltip.x}
                  y={tooltip.y - 12}
                  textAnchor="middle"
                  fill="hsl(46, 56%, 52%)"
                  fontSize={9}
                  className="select-none"
                >
                  {tooltip.node.year} {isAr ? "م" : "CE"} · {tooltip.node.connections} {isAr ? "روابط" : "links"}
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default EventRelationshipGraph;
