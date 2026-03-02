import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ExternalLink, Plus, Minus, Maximize, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import EventDetailModal, { type EventDetailData, type RelatedEvent } from "@/components/EventDetailModal";
import EventsSidebar from "@/components/journey/EventsSidebar";

const MIN_YEAR = 570;
const MAX_YEAR = 632;
const AUTOPLAY_INTERVAL = 3000;

interface TimelineEvent {
  id: string;
  year_ce: number;
  year_hijri: string | null;
  era: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  category: string;
  location_id: string | null;
  path_id: string | null;
  image_url: string | null;
  map_x: number;
  map_y: number;
  is_major: boolean;
  timeline_visible: boolean;
  display_order: number;
}

const categoryColors: Record<string, string> = {
  milestone: "46 56% 52%",
  battle: "0 72% 50%",
  contract: "200 60% 50%",
  challenge: "30 80% 50%",
  marriage: "330 60% 55%",
  diplomacy: "160 50% 40%",
};

const fallbackTimelineEvents: TimelineEvent[] = [
  { id: "fb-570", year_ce: 570, year_hijri: null, era: "makkah", title: "حادثة الفيل ومولد النبي ﷺ", title_en: "Year of the Elephant & Birth of the Prophet ﷺ", description: "بداية الرحلة التاريخية في مكة.", description_en: "The historical journey begins in Makkah.", category: "milestone", location_id: "makkah", path_id: null, image_url: null, map_x: 38.5, map_y: 62, is_major: true, timeline_visible: true, display_order: 1 },
  { id: "fb-610", year_ce: 610, year_hijri: null, era: "makkah", title: "نزول الوحي في غار حراء", title_en: "First Revelation in Cave Hira", description: "نقطة التحول الكبرى ببداية البعثة.", description_en: "The major turning point with the beginning of revelation.", category: "milestone", location_id: "makkah", path_id: null, image_url: null, map_x: 38.5, map_y: 62, is_major: true, timeline_visible: true, display_order: 2 },
  { id: "fb-622", year_ce: 622, year_hijri: "1", era: "madinah", title: "الهجرة الكبرى", title_en: "The Great Hijrah", description: "انتقال مركز الرسالة من مكة إلى المدينة.", description_en: "The mission center moved from Makkah to Madinah.", category: "milestone", location_id: "madinah", path_id: null, image_url: null, map_x: 37, map_y: 47.5, is_major: true, timeline_visible: true, display_order: 3 },
  { id: "fb-624", year_ce: 624, year_hijri: "2", era: "madinah", title: "غزوة بدر", title_en: "Battle of Badr", description: "أول معركة فاصلة في التاريخ الإسلامي.", description_en: "The first decisive battle in Islamic history.", category: "battle", location_id: "badr", path_id: null, image_url: null, map_x: 36, map_y: 55, is_major: true, timeline_visible: true, display_order: 4 },
  { id: "fb-628", year_ce: 628, year_hijri: "6", era: "madinah", title: "صلح الحديبية", title_en: "Treaty of Hudaybiyyah", description: "معاهدة مهدت للفتح المبين.", description_en: "A treaty that paved the way for clear victory.", category: "contract", location_id: "hudaybiyyah", path_id: null, image_url: null, map_x: 37, map_y: 63, is_major: true, timeline_visible: true, display_order: 5 },
  { id: "fb-630", year_ce: 630, year_hijri: "8", era: "madinah", title: "فتح مكة", title_en: "Conquest of Makkah", description: "عودة إلى مكة في مشهد تاريخي عظيم.", description_en: "A historic return to Makkah.", category: "milestone", location_id: "makkah", path_id: null, image_url: null, map_x: 38.5, map_y: 62, is_major: true, timeline_visible: true, display_order: 6 },
  { id: "fb-632", year_ce: 632, year_hijri: "11", era: "madinah", title: "وفاة النبي ﷺ", title_en: "Passing of the Prophet ﷺ", description: "ختام الرحلة المباركة في المدينة.", description_en: "The blessed journey concludes in Madinah.", category: "milestone", location_id: "madinah", path_id: null, image_url: null, map_x: 37, map_y: 47.5, is_major: true, timeline_visible: true, display_order: 7 },
];

// --- Zoom/Pan state ---
interface Transform {
  scale: number;
  x: number;
  y: number;
}

const INITIAL_TRANSFORM: Transform = { scale: 1, x: 0, y: 0 };
const MIN_SCALE = 0.8;
const MAX_SCALE = 5;
const CLUSTER_RADIUS = 4; // SVG units for clustering proximity

const InteractiveJourneyPage = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [currentYear, setCurrentYear] = useState(MIN_YEAR);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<TimelineEvent[]>(fallbackTimelineEvents);
  const [paths, setPaths] = useState<any[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<EventDetailData | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<RelatedEvent[]>([]);
  const [transform, setTransform] = useState<Transform>(INITIAL_TRANSFORM);
  const [sidebarEvents, setSidebarEvents] = useState<TimelineEvent[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTitle, setSidebarTitle] = useState("");
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [hoveredClusterKey, setHoveredClusterKey] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      const [eventsRes, pathsRes] = await Promise.all([
        supabase.from("timeline_events").select("*").eq("is_active", true).eq("timeline_visible", true).order("display_order"),
        supabase.from("paths").select("*, path_steps(*)").eq("is_active", true).order("created_at"),
      ]);
      if (!mounted) return;
      if (!eventsRes.error && eventsRes.data && eventsRes.data.length > 0) setEvents(eventsRes.data as TimelineEvent[]);
      if (!pathsRes.error && pathsRes.data) setPaths(pathsRes.data as any[]);
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  // Visible events: current year + 2 previous event-years
  const visibleEvents = useMemo(() => {
    const pastEvents = events.filter((e) => e.year_ce <= currentYear);
    const uniqueYears = [...new Set(pastEvents.map((e) => e.year_ce))].sort((a, b) => b - a);
    const recentYears = uniqueYears.slice(0, 3);
    return pastEvents.filter((e) => recentYears.includes(e.year_ce));
  }, [events, currentYear]);

  const currentYearEvents = useMemo(() => events.filter((e) => e.year_ce === currentYear), [events, currentYear]);

  const era = currentYear < 622 ? "makkah" : "madinah";
  const eraLabel = isAr
    ? era === "makkah" ? "العهد المكي" : "العهد المدني"
    : era === "makkah" ? "Makkan Period" : "Madinan Period";

  // Cluster events by proximity
  const clusters = useMemo(() => {
    const used = new Set<number>();
    const result: { cx: number; cy: number; events: TimelineEvent[] }[] = [];

    visibleEvents.forEach((e, i) => {
      if (used.has(i)) return;
      const cluster: TimelineEvent[] = [e];
      used.add(i);
      visibleEvents.forEach((e2, j) => {
        if (used.has(j)) return;
        const dist = Math.sqrt((e.map_x - e2.map_x) ** 2 + (e.map_y - e2.map_y) ** 2);
        // Adjust cluster radius based on zoom level
        if (dist < CLUSTER_RADIUS / transform.scale) {
          cluster.push(e2);
          used.add(j);
        }
      });
      const cx = cluster.reduce((s, ev) => s + ev.map_x, 0) / cluster.length;
      const cy = cluster.reduce((s, ev) => s + ev.map_y, 0) / cluster.length;
      result.push({ cx, cy, events: cluster });
    });
    return result;
  }, [visibleEvents, transform.scale]);

  // Auto-pan to current year's events center
  useEffect(() => {
    if (currentYearEvents.length === 0) return;
    const cx = currentYearEvents.reduce((s, e) => s + e.map_x, 0) / currentYearEvents.length;
    const cy = currentYearEvents.reduce((s, e) => s + e.map_y, 0) / currentYearEvents.length;
    // Pan to center events, keep current zoom unless it's default
    const scale = transform.scale < 1.5 ? 1.8 : transform.scale;
    setTransform({
      scale,
      x: 50 - cx * scale,
      y: 50 - cy * scale,
    });
  }, [currentYear]);

  // Update sidebar when year changes
  useEffect(() => {
    if (sidebarOpen && currentYearEvents.length > 0) {
      setSidebarEvents(currentYearEvents);
      setSidebarTitle(`${currentYear} ${isAr ? "م" : "CE"}`);
    }
  }, [currentYear, currentYearEvents, sidebarOpen, isAr]);

  // Autoplay
  const stopPlaying = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const yearEvents = [...new Set(events.map((e) => e.year_ce))].sort((a, b) => a - b);
    let idx = yearEvents.findIndex((y) => y >= currentYear);
    if (idx < 0) idx = 0;
    intervalRef.current = window.setInterval(() => {
      idx++;
      if (idx >= yearEvents.length) { stopPlaying(); return; }
      setCurrentYear(yearEvents[idx]);
    }, AUTOPLAY_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, events, stopPlaying]);

  const handleSliderChange = (value: number[]) => {
    stopPlaying();
    setCurrentYear(value[0]);
  };

  const handleAutoPlay = () => {
    if (isPlaying) { stopPlaying(); } else {
      if (currentYear >= MAX_YEAR) setCurrentYear(MIN_YEAR);
      setSidebarOpen(true);
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    stopPlaying();
    setCurrentYear(MIN_YEAR);
    setTransform(INITIAL_TRANSFORM);
    setSidebarOpen(false);
  };

  // Zoom controls
  const zoomIn = () => setTransform((t) => ({ ...t, scale: Math.min(t.scale * 1.4, MAX_SCALE) }));
  const zoomOut = () => setTransform((t) => ({ ...t, scale: Math.max(t.scale / 1.4, MIN_SCALE) }));
  const resetView = () => setTransform(INITIAL_TRANSFORM);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform((t) => ({
      ...t,
      scale: Math.min(Math.max(t.scale * factor, MIN_SCALE), MAX_SCALE),
    }));
  }, []);

  // Touch pinch zoom
  const lastTouchDist = useRef<number | null>(null);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastTouchDist.current !== null) {
        const factor = dist / lastTouchDist.current;
        setTransform((t) => ({
          ...t,
          scale: Math.min(Math.max(t.scale * factor, MIN_SCALE), MAX_SCALE),
        }));
      }
      lastTouchDist.current = dist;
    } else if (e.touches.length === 1 && isPanning) {
      const dx = e.touches[0].clientX - panStart.current.x;
      const dy = e.touches[0].clientY - panStart.current.y;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setTransform((t) => ({
        ...t,
        x: panStart.current.tx + (dx / rect.width) * 100,
        y: panStart.current.ty + (dy / rect.height) * 100,
      }));
    }
  }, [isPanning]);

  const handleTouchEnd = useCallback(() => {
    lastTouchDist.current = null;
    setIsPanning(false);
  }, []);

  // Mouse pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
  }, [transform.x, transform.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setTransform((t) => ({
      ...t,
      x: panStart.current.tx + (dx / rect.width) * 100,
      y: panStart.current.ty + (dy / rect.height) * 100,
    }));
  }, [isPanning]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  // Cluster click: zoom in or open sidebar
  const handleClusterClick = (cluster: { cx: number; cy: number; events: TimelineEvent[] }) => {
    if (cluster.events.length > 1 && transform.scale < 3) {
      // Zoom in to fit bounds
      const minX = Math.min(...cluster.events.map((e) => e.map_x));
      const maxX = Math.max(...cluster.events.map((e) => e.map_x));
      const minY = Math.min(...cluster.events.map((e) => e.map_y));
      const maxY = Math.max(...cluster.events.map((e) => e.map_y));
      const spanX = Math.max(maxX - minX, 5);
      const spanY = Math.max(maxY - minY, 5);
      const newScale = Math.min(80 / Math.max(spanX, spanY), MAX_SCALE);
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      setTransform({
        scale: newScale,
        x: 50 - centerX * newScale,
        y: 50 - centerY * newScale,
      });
    }
    // Always open sidebar with cluster events
    setSidebarEvents(cluster.events);
    setSidebarTitle(
      cluster.events.length === 1
        ? (isAr ? cluster.events[0].title : cluster.events[0].title_en)
        : `${cluster.events[0].year_ce} ${isAr ? "م" : "CE"} — ${cluster.events.length} ${isAr ? "أحداث" : "events"}`
    );
    setSidebarOpen(true);
  };

  // Open event detail modal
  const openEventDetail = useCallback(async (eventId: string) => {
    const { data } = await supabase.from("timeline_events").select("*").eq("id", eventId).single();
    if (!data) return;
    const eventData: EventDetailData = {
      id: data.id, title: data.title, title_en: data.title_en, description: data.description, description_en: data.description_en,
      full_story: (data as any).full_story || null, full_story_en: (data as any).full_story_en || null,
      year_ce: data.year_ce, year_hijri: data.year_hijri, era: data.era, category: data.category, image_url: data.image_url, location_id: data.location_id,
      quran_references: (data as any).quran_references || [], hadith_references: (data as any).hadith_references || [], related_event_ids: (data as any).related_event_ids || [],
    };
    setDetailEvent(eventData);
    const relIds = eventData.related_event_ids || [];
    if (relIds.length > 0) {
      const { data: relData } = await supabase.from("timeline_events").select("id, title, title_en, year_ce, category").in("id", relIds);
      setRelatedEvents((relData || []) as RelatedEvent[]);
    } else { setRelatedEvents([]); }
    setDetailModalOpen(true);
  }, []);

  // Active path lines
  const activePathLines = useMemo(() => {
    const matchedEvents = visibleEvents.filter((e) => e.path_id);
    const pathIds = [...new Set(matchedEvents.map((e) => e.path_id))];
    return paths.filter((p: any) => pathIds.includes(p.id));
  }, [visibleEvents, paths]);

  // Show labels only when zoomed in enough
  const showLabels = transform.scale >= 2;

  return (
    <div className="flex flex-col bg-background overflow-hidden pt-16 md:pt-20" dir={isAr ? "rtl" : "ltr"} style={{ height: "100vh" }}>
      {/* Full-screen Map */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            setIsPanning(true);
            panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, tx: transform.x, ty: transform.y };
          }
        }}
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full absolute inset-0"
          preserveAspectRatio="xMidYMid meet"
          style={{
            background: era === "makkah"
              ? "linear-gradient(180deg, hsl(48 44% 92%) 0%, hsl(48 30% 85%) 100%)"
              : "linear-gradient(180deg, hsl(160 30% 90%) 0%, hsl(160 20% 82%) 100%)",
          }}
        >
          <defs>
            <radialGradient id="tl-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(46 56% 52%)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(46 56% 52%)" stopOpacity="0" />
            </radialGradient>
            <filter id="glow-pulse">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <g
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              transformOrigin: "0 0",
              transition: isPanning ? "none" : "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            {/* Peninsula */}
            <path d="M 25 20 Q 30 18, 40 20 L 55 22 Q 62 24, 65 30 L 68 38 Q 70 42, 68 48 L 65 55 Q 62 62, 58 68 L 52 75 Q 48 80, 42 82 L 35 80 Q 30 78, 28 74 L 25 68 Q 22 62, 20 55 L 18 45 Q 17 35, 20 28 Z" fill="hsl(48 44% 92%)" stroke="hsl(48 30% 78%)" strokeWidth="0.4" />
            {/* West coast water */}
            <path d="M 25 20 Q 22 30, 18 45 Q 17 55, 22 65 L 28 74 Q 30 78, 35 80 L 30 82 Q 24 78, 20 70 Q 14 58, 12 45 Q 11 32, 15 22 Z" fill="hsl(200 50% 88%)" fillOpacity="0.5" stroke="hsl(200 40% 75%)" strokeWidth="0.3" />
            {/* East coast water */}
            <path d="M 65 30 Q 70 32, 72 36 L 73 42 Q 72 48, 68 48 L 65 55 Q 68 50, 70 44 Q 72 38, 68 34 Z" fill="hsl(200 50% 88%)" fillOpacity="0.5" stroke="hsl(200 40% 75%)" strokeWidth="0.3" />

            {/* Region labels */}
            <text x="42" y="40" fontSize="2" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic" className="font-body">نجد</text>
            <text x="30" y="55" fontSize="2" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic" className="font-body">الحجاز</text>
            <text x="55" y="70" fontSize="1.8" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic" className="font-body">اليمن</text>

            {/* Path lines */}
            {activePathLines.map((p: any) => {
              const steps = (p.path_steps || []).sort((a: any, b: any) => a.step_order - b.step_order);
              if (steps.length < 2) return null;
              return steps.slice(1).map((step: any, i: number) => {
                const prev = steps[i];
                return (
                  <path
                    key={`path-${p.id}-${i}`}
                    d={`M ${prev.coord_x} ${prev.coord_y} L ${step.coord_x} ${step.coord_y}`}
                    fill="none"
                    stroke={`hsl(${p.line_color})`}
                    strokeWidth={0.5 / transform.scale}
                    strokeDasharray={step.segment_type === "sea" ? "1 0.8" : "none"}
                    strokeLinecap="round"
                    opacity="0.7"
                    style={{ animation: "dash 3s linear infinite" }}
                  />
                );
              });
            })}

            {/* Clustered markers */}
            <TooltipProvider>
              {clusters.map((cluster, ci) => {
                const key = `cluster-${ci}`;
                const isMulti = cluster.events.length > 1;
                const first = cluster.events[0];
                const isCurrentYear = cluster.events.some((e) => e.year_ce === currentYear);
                const catColor = categoryColors[first.category] || "46 56% 52%";
                const isGlowing = isCurrentYear && first.is_major;
                const markerSize = isMulti ? 2.2 : (isCurrentYear ? 1.4 : 1);

                return (
                  <g
                    key={key}
                    className="cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleClusterClick(cluster); }}
                    onMouseEnter={() => setHoveredClusterKey(key)}
                    onMouseLeave={() => setHoveredClusterKey(null)}
                  >
                    {/* Glow for current year major events */}
                    {isGlowing && (
                      <circle cx={cluster.cx} cy={cluster.cy} r="3" filter="url(#glow-pulse)">
                        <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
                        <set attributeName="fill" to={`hsl(${catColor})`} />
                      </circle>
                    )}

                    {/* Pulsing ring for current year */}
                    {isCurrentYear && (
                      <circle cx={cluster.cx} cy={cluster.cy} r="2" fill="none" stroke={`hsl(${catColor})`} strokeWidth="0.2" opacity="0.5">
                        <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Main marker - color coded by category */}
                    <circle
                      cx={cluster.cx}
                      cy={cluster.cy}
                      r={markerSize}
                      fill={isCurrentYear ? `hsl(${catColor})` : isMulti ? "hsl(var(--primary))" : "hsl(var(--primary-foreground))"}
                      stroke={`hsl(${catColor})`}
                      strokeWidth={0.25 / Math.max(transform.scale * 0.5, 0.5)}
                      className="transition-all duration-300"
                    />

                    {/* Cluster count badge */}
                    {isMulti && (
                      <>
                        <circle
                          cx={cluster.cx + 1.5 / transform.scale}
                          cy={cluster.cy - 1.5 / transform.scale}
                          r={1.1 / Math.max(transform.scale * 0.5, 0.5)}
                          fill="hsl(var(--secondary))"
                          stroke="hsl(var(--primary-foreground))"
                          strokeWidth={0.15 / Math.max(transform.scale * 0.5, 0.5)}
                        />
                        <text
                          x={cluster.cx + 1.5 / transform.scale}
                          y={cluster.cy - 1.2 / transform.scale}
                          textAnchor="middle"
                          fontSize={0.9 / Math.max(transform.scale * 0.5, 0.5)}
                          fill="hsl(var(--primary))"
                          fontWeight="700"
                          className="font-body pointer-events-none"
                        >
                          {cluster.events.length}
                        </text>
                      </>
                    )}

                    {/* Labels only when zoomed in */}
                    {showLabels && !isMulti && (
                      <text
                        x={cluster.cx}
                        y={cluster.cy - 2.5 / transform.scale}
                        textAnchor="middle"
                        fontSize={1.4 / transform.scale}
                        fontWeight={isCurrentYear ? "700" : "500"}
                        fill="hsl(var(--foreground))"
                        opacity={isCurrentYear ? 1 : 0.7}
                        className="font-body pointer-events-none"
                      >
                        {isAr ? first.title.substring(0, 20) : first.title_en.substring(0, 25)}
                      </text>
                    )}

                    {/* Tooltip on hover (only when not showing labels) */}
                    {!showLabels && hoveredClusterKey === key && (
                      <g className="pointer-events-none">
                        <rect
                          x={cluster.cx - 8}
                          y={cluster.cy - 4.5}
                          width="16"
                          height="3"
                          rx="0.5"
                          fill="hsl(var(--card))"
                          fillOpacity="0.95"
                          stroke="hsl(var(--border))"
                          strokeWidth={0.15 / Math.max(transform.scale * 0.5, 0.5)}
                        />
                        <text
                          x={cluster.cx}
                          y={cluster.cy - 2.5}
                          textAnchor="middle"
                          fontSize={1.3 / Math.max(transform.scale * 0.5, 0.5)}
                          fontWeight="600"
                          fill="hsl(var(--foreground))"
                          className="font-body"
                        >
                          {isMulti
                            ? `${cluster.events.length} ${isAr ? "أحداث" : "events"}`
                            : (isAr ? first.title.substring(0, 18) : first.title_en.substring(0, 22))}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </TooltipProvider>
          </g>
        </svg>

        {/* Zoom Controls - bottom right */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
          <Button size="icon" variant="outline" onClick={zoomIn} className="h-9 w-9 bg-card/90 backdrop-blur-sm shadow-md border-border hover:bg-muted">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={zoomOut} className="h-9 w-9 bg-card/90 backdrop-blur-sm shadow-md border-border hover:bg-muted">
            <Minus className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={resetView} className="h-9 w-9 bg-card/90 backdrop-blur-sm shadow-md border-border hover:bg-muted">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoom level indicator */}
        <div className="absolute bottom-4 left-4 z-20 px-2 py-1 rounded bg-card/80 backdrop-blur-sm border border-border text-xs text-muted-foreground font-body">
          {Math.round(transform.scale * 100)}%
        </div>

        {/* Era indicator */}
        <div className="absolute top-4 left-4 z-20">
          <motion.div key={era} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-sm">
            <span className="text-sm font-medium text-foreground">{eraLabel}</span>
          </motion.div>
        </div>

        {/* Events Sidebar */}
        <EventsSidebar
          events={sidebarEvents}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onEventClick={openEventDetail}
          title={sidebarTitle}
        />
      </div>

      {/* Time-Bar at bottom */}
      <div className="relative z-30 border-t border-border bg-card/95 backdrop-blur-md px-4 py-4 md:px-8 md:py-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost" onClick={handleAutoPlay} className="gap-2 text-secondary hover:text-secondary">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? (isAr ? "إيقاف" : "Pause") : (isAr ? "تشغيل تلقائي" : "Auto-Play")}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center">
            <motion.div key={currentYear} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
              <span className="font-serif-display text-2xl md:text-3xl font-bold text-secondary gold-glow rounded-lg px-3">
                {currentYear} {isAr ? "م" : "CE"}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">{eraLabel}</span>
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={sidebarOpen ? "default" : "outline"}
              onClick={() => {
                if (!sidebarOpen) {
                  setSidebarEvents(currentYearEvents);
                  setSidebarTitle(`${currentYear} ${isAr ? "م" : "CE"}`);
                }
                setSidebarOpen(!sidebarOpen);
              }}
              className="gap-1 text-xs"
            >
              <ChevronRight className="h-3.5 w-3.5" />
              {currentYearEvents.length} {isAr ? "حدث" : "events"}
            </Button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 pointer-events-none">
            {events.map((e) => {
              const pct = ((e.year_ce - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
              return (
                <div
                  key={e.id}
                  className="absolute top-1/2 -translate-y-1/2 w-0.5 rounded-full"
                  style={{
                    left: `${pct}%`,
                    height: e.is_major ? "12px" : "6px",
                    backgroundColor: `hsl(${categoryColors[e.category] || "46 56% 52%"} / ${e.is_major ? 0.8 : 0.3})`,
                  }}
                />
              );
            })}
          </div>
          <Slider
            value={[currentYear]}
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            onValueChange={handleSliderChange}
            className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-secondary [&_[role=slider]]:border-2 [&_[role=slider]]:border-secondary/80 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-secondary/30 [&_[role=slider]]:rounded-full [&_[data-orientation=horizontal]>[data-orientation=horizontal]]:bg-secondary/60 [&_[data-orientation=horizontal]]:bg-border"
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{MIN_YEAR} {isAr ? "م" : "CE"}</span>
            <span>622 {isAr ? "م · الهجرة" : "CE · Hijrah"}</span>
            <span>{MAX_YEAR} {isAr ? "م" : "CE"}</span>
          </div>
        </div>
      </div>

      <EventDetailModal
        event={detailEvent}
        relatedEvents={relatedEvents}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onRelatedEventClick={(id) => { setDetailModalOpen(false); setTimeout(() => openEventDetail(id), 300); }}
      />
    </div>
  );
};

export default InteractiveJourneyPage;
