import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import EventDetailModal, { type EventDetailData, type RelatedEvent } from "@/components/EventDetailModal";

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
  {
    id: "fb-570",
    year_ce: 570,
    year_hijri: null,
    era: "makkah",
    title: "حادثة الفيل ومولد النبي ﷺ",
    title_en: "Year of the Elephant & Birth of the Prophet ﷺ",
    description: "بداية الرحلة التاريخية في مكة.",
    description_en: "The historical journey begins in Makkah.",
    category: "milestone",
    location_id: "makkah",
    path_id: null,
    image_url: null,
    map_x: 38.5,
    map_y: 62,
    is_major: true,
    timeline_visible: true,
    display_order: 1,
  },
  {
    id: "fb-610",
    year_ce: 610,
    year_hijri: null,
    era: "makkah",
    title: "نزول الوحي في غار حراء",
    title_en: "First Revelation in Cave Hira",
    description: "نقطة التحول الكبرى ببداية البعثة.",
    description_en: "The major turning point with the beginning of revelation.",
    category: "milestone",
    location_id: "makkah",
    path_id: null,
    image_url: null,
    map_x: 38.5,
    map_y: 62,
    is_major: true,
    timeline_visible: true,
    display_order: 2,
  },
  {
    id: "fb-622",
    year_ce: 622,
    year_hijri: "1",
    era: "madinah",
    title: "الهجرة الكبرى",
    title_en: "The Great Hijrah",
    description: "انتقال مركز الرسالة من مكة إلى المدينة.",
    description_en: "The mission center moved from Makkah to Madinah.",
    category: "milestone",
    location_id: "madinah",
    path_id: null,
    image_url: null,
    map_x: 37,
    map_y: 47.5,
    is_major: true,
    timeline_visible: true,
    display_order: 3,
  },
  {
    id: "fb-624",
    year_ce: 624,
    year_hijri: "2",
    era: "madinah",
    title: "غزوة بدر",
    title_en: "Battle of Badr",
    description: "أول معركة فاصلة في التاريخ الإسلامي.",
    description_en: "The first decisive battle in Islamic history.",
    category: "battle",
    location_id: "badr",
    path_id: null,
    image_url: null,
    map_x: 36,
    map_y: 55,
    is_major: true,
    timeline_visible: true,
    display_order: 4,
  },
  {
    id: "fb-628",
    year_ce: 628,
    year_hijri: "6",
    era: "madinah",
    title: "صلح الحديبية",
    title_en: "Treaty of Hudaybiyyah",
    description: "معاهدة مهدت للفتح المبين.",
    description_en: "A treaty that paved the way for clear victory.",
    category: "contract",
    location_id: "hudaybiyyah",
    path_id: null,
    image_url: null,
    map_x: 37,
    map_y: 63,
    is_major: true,
    timeline_visible: true,
    display_order: 5,
  },
  {
    id: "fb-630",
    year_ce: 630,
    year_hijri: "8",
    era: "madinah",
    title: "فتح مكة",
    title_en: "Conquest of Makkah",
    description: "عودة إلى مكة في مشهد تاريخي عظيم.",
    description_en: "A historic return to Makkah.",
    category: "milestone",
    location_id: "makkah",
    path_id: null,
    image_url: null,
    map_x: 38.5,
    map_y: 62,
    is_major: true,
    timeline_visible: true,
    display_order: 6,
  },
  {
    id: "fb-632",
    year_ce: 632,
    year_hijri: "11",
    era: "madinah",
    title: "وفاة النبي ﷺ",
    title_en: "Passing of the Prophet ﷺ",
    description: "ختام الرحلة المباركة في المدينة.",
    description_en: "The blessed journey concludes in Madinah.",
    category: "milestone",
    location_id: "madinah",
    path_id: null,
    image_url: null,
    map_x: 37,
    map_y: 47.5,
    is_major: true,
    timeline_visible: true,
    display_order: 7,
  },
];

const InteractiveJourneyPage = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [currentYear, setCurrentYear] = useState(MIN_YEAR);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState("0 0 100 100");
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>(fallbackTimelineEvents);
  const [paths, setPaths] = useState<any[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<EventDetailData | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<RelatedEvent[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      const [eventsRes, pathsRes] = await Promise.all([
        supabase
          .from("timeline_events")
          .select("*")
          .eq("is_active", true)
          .eq("timeline_visible", true)
          .order("display_order"),
        supabase
          .from("paths")
          .select("*, path_steps(*)")
          .eq("is_active", true)
          .order("created_at"),
      ]);

      if (!mounted) return;

      if (!eventsRes.error && eventsRes.data && eventsRes.data.length > 0) {
        setEvents(eventsRes.data as TimelineEvent[]);
      }

      if (!pathsRes.error && pathsRes.data) {
        setPaths(pathsRes.data as any[]);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  // Only show events from the current year and the 2 previous event-years (last ~3 groups)
  const visibleEvents = useMemo(() => {
    const pastEvents = events.filter((e) => e.year_ce <= currentYear);
    const uniqueYears = [...new Set(pastEvents.map((e) => e.year_ce))].sort((a, b) => b - a);
    const recentYears = uniqueYears.slice(0, 3);
    return pastEvents.filter((e) => recentYears.includes(e.year_ce));
  }, [events, currentYear]);

  const currentYearEvents = useMemo(
    () => events.filter((e) => e.year_ce === currentYear),
    [events, currentYear]
  );

  const majorEvent = useMemo(
    () => currentYearEvents.find((e) => e.is_major) || currentYearEvents[0],
    [currentYearEvents]
  );

  const era = currentYear < 622 ? "makkah" : "madinah";
  const eraLabel = isAr
    ? era === "makkah" ? "العهد المكي" : "العهد المدني"
    : era === "makkah" ? "Makkan Period" : "Madinan Period";

  // Auto-pan map based on era
  useEffect(() => {
    if (era === "makkah") {
      setViewBox("15 25 70 65");
    } else {
      setViewBox("20 30 50 50");
    }
  }, [era]);


  // Autoplay
  const stopPlaying = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const yearEvents = [...new Set(events.map((e) => e.year_ce))].sort((a, b) => a - b);
    let idx = yearEvents.findIndex((y) => y >= currentYear);
    if (idx < 0) idx = 0;

    intervalRef.current = window.setInterval(() => {
      idx++;
      if (idx >= yearEvents.length) {
        stopPlaying();
        return;
      }
      setCurrentYear(yearEvents[idx]);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, events, stopPlaying]);

  const handleSliderChange = (value: number[]) => {
    stopPlaying();
    setCurrentYear(value[0]);
    setSelectedEvent(null);
  };

  const handleAutoPlay = () => {
    if (isPlaying) {
      stopPlaying();
    } else {
      if (currentYear >= MAX_YEAR) setCurrentYear(MIN_YEAR);
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    stopPlaying();
    setCurrentYear(MIN_YEAR);
    setSelectedEvent(null);
  };

  const openEventDetail = useCallback(async (eventId: string) => {
    const { data } = await supabase
      .from("timeline_events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (!data) return;

    const eventData: EventDetailData = {
      id: data.id,
      title: data.title,
      title_en: data.title_en,
      description: data.description,
      description_en: data.description_en,
      full_story: (data as any).full_story || null,
      full_story_en: (data as any).full_story_en || null,
      year_ce: data.year_ce,
      year_hijri: data.year_hijri,
      era: data.era,
      category: data.category,
      image_url: data.image_url,
      location_id: data.location_id,
      quran_references: (data as any).quran_references || [],
      hadith_references: (data as any).hadith_references || [],
      related_event_ids: (data as any).related_event_ids || [],
    };

    setDetailEvent(eventData);

    // Fetch related events
    const relIds = eventData.related_event_ids || [];
    if (relIds.length > 0) {
      const { data: relData } = await supabase
        .from("timeline_events")
        .select("id, title, title_en, year_ce, category")
        .in("id", relIds);
      setRelatedEvents((relData || []) as RelatedEvent[]);
    } else {
      setRelatedEvents([]);
    }

    setDetailModalOpen(true);
  }, []);

  // Get active paths for current year
  const activePathLines = useMemo(() => {
    const matchedEvents = visibleEvents.filter((e) => e.path_id);
    const pathIds = [...new Set(matchedEvents.map((e) => e.path_id))];
    return paths.filter((p: any) => pathIds.includes(p.id));
  }, [visibleEvents, paths]);

  // Cluster events by location
  const clustered = useMemo(() => {
    const map = new Map<string, TimelineEvent[]>();
    visibleEvents.forEach((e) => {
      const key = `${e.map_x.toFixed(1)}_${e.map_y.toFixed(1)}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }, [visibleEvents]);

  return (
    <div className="flex flex-col bg-background overflow-hidden pt-16 md:pt-20" dir={isAr ? "rtl" : "ltr"} style={{ height: "100vh" }}>
      {/* Full-screen Map */}
      <div className="flex-1 relative">
        <svg
          ref={mapRef}
          viewBox={viewBox}
          className="w-full h-full absolute inset-0 transition-all duration-1000 ease-in-out"
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
            <filter id="tl-blur">
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-pulse">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Peninsula */}
          <path
            d="M 25 20 Q 30 18, 40 20 L 55 22 Q 62 24, 65 30 L 68 38 Q 70 42, 68 48 L 65 55 Q 62 62, 58 68 L 52 75 Q 48 80, 42 82 L 35 80 Q 30 78, 28 74 L 25 68 Q 22 62, 20 55 L 18 45 Q 17 35, 20 28 Z"
            fill="hsl(48 44% 92%)"
            stroke="hsl(48 30% 78%)"
            strokeWidth="0.4"
          />
          {/* West coast water */}
          <path
            d="M 25 20 Q 22 30, 18 45 Q 17 55, 22 65 L 28 74 Q 30 78, 35 80 L 30 82 Q 24 78, 20 70 Q 14 58, 12 45 Q 11 32, 15 22 Z"
            fill="hsl(200 50% 88%)" fillOpacity="0.5"
            stroke="hsl(200 40% 75%)" strokeWidth="0.3"
          />
          {/* East coast water */}
          <path
            d="M 65 30 Q 70 32, 72 36 L 73 42 Q 72 48, 68 48 L 65 55 Q 68 50, 70 44 Q 72 38, 68 34 Z"
            fill="hsl(200 50% 88%)" fillOpacity="0.5"
            stroke="hsl(200 40% 75%)" strokeWidth="0.3"
          />

          {/* Path lines for active journeys */}
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
                  strokeWidth="0.5"
                  strokeDasharray={step.segment_type === "sea" ? "1 0.8" : "none"}
                  strokeLinecap="round"
                  opacity="0.7"
                  style={{ animation: "dash 3s linear infinite" }}
                />
              );
            });
          })}

          {/* Event markers */}
          {Array.from(clustered.entries()).map(([key, clusterEvents]) => {
            const first = clusterEvents[0];
            const isCurrentYear = clusterEvents.some((e) => e.year_ce === currentYear);
            const isCluster = clusterEvents.length > 1;
            const catColor = categoryColors[first.category] || "46 56% 52%";
            const isGlowing = isCurrentYear && first.is_major;

            return (
              <g
                key={key}
                onClick={() => setSelectedEvent(isCluster ? null : first)}
                onMouseEnter={() => setHoveredEvent(first)}
                onMouseLeave={() => setHoveredEvent(null)}
                className="cursor-pointer"
              >
                {/* Glow effect for current year major events */}
                {isGlowing && (
                  <circle cx={first.map_x} cy={first.map_y} r="3" filter="url(#glow-pulse)">
                    <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
                    <set attributeName="fill" to={`hsl(${catColor})`} />
                  </circle>
                )}

                {/* Pulsing ring */}
                {isCurrentYear && (
                  <circle
                    cx={first.map_x}
                    cy={first.map_y}
                    r="2"
                    fill="none"
                    stroke={`hsl(${catColor})`}
                    strokeWidth="0.2"
                    opacity="0.5"
                  >
                    <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Main marker */}
                <circle
                  cx={first.map_x}
                  cy={first.map_y}
                  r={isCurrentYear ? 1.4 : 1}
                  fill={isCurrentYear ? `hsl(${catColor})` : "hsl(60 33% 97%)"}
                  stroke={`hsl(${catColor})`}
                  strokeWidth="0.25"
                  className="transition-all duration-300"
                />

                {/* Cluster badge */}
                {isCluster && (
                  <>
                    <circle
                      cx={first.map_x + 1.3}
                      cy={first.map_y - 1.3}
                      r="0.9"
                      fill="hsl(var(--primary))"
                    />
                    <text
                      x={first.map_x + 1.3}
                      y={first.map_y - 1}
                      textAnchor="middle"
                      fontSize="0.8"
                      fill="hsl(var(--primary-foreground))"
                      fontWeight="700"
                    >
                      {clusterEvents.length}
                    </text>
                  </>
                )}

                {/* Location label */}
                <text
                  x={first.map_x}
                  y={first.map_y - 2.2}
                  textAnchor="middle"
                  fontSize={isCurrentYear ? "1.6" : "1.2"}
                  fontWeight={isCurrentYear ? "700" : "500"}
                  fill="hsl(160 90% 16%)"
                  opacity={isCurrentYear ? 1 : 0.6}
                  className="font-body pointer-events-none transition-all duration-300"
                >
                  {isAr ? first.title.substring(0, 20) : first.title_en.substring(0, 25)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Preview Card */}
        <AnimatePresence>
          {majorEvent && currentYearEvents.length > 0 && (
            <motion.div
              key={majorEvent.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute top-4 left-4 right-4 md:left-auto md:right-6 md:top-6 md:max-w-sm z-20"
            >
              <div className="rounded-xl border border-border bg-card/90 backdrop-blur-md shadow-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: `hsl(${categoryColors[majorEvent.category] || "46 56% 52%"})` }}
                  />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {majorEvent.year_ce} {isAr ? "م" : "CE"}
                    {majorEvent.year_hijri && ` · ${majorEvent.year_hijri} ${isAr ? "هـ" : "AH"}`}
                  </span>
                </div>
                <h3 className="font-serif-display text-lg font-bold text-foreground leading-tight">
                  {isAr ? majorEvent.title : majorEvent.title_en}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isAr ? majorEvent.description : majorEvent.description_en}
                </p>
                {majorEvent.image_url && (
                  <img
                    src={majorEvent.image_url}
                    alt=""
                    className="rounded-lg w-full h-32 object-cover"
                  />
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-2 text-secondary border-secondary/30 hover:bg-secondary/10"
                  onClick={() => openEventDetail(majorEvent.id)}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {isAr ? "اقرأ المزيد" : "Learn More"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Era indicator */}
        <div className="absolute top-4 right-4 md:top-6 md:left-6 md:right-auto z-10">
          <motion.div
            key={era}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-sm"
          >
            <span className="text-sm font-medium text-foreground">{eraLabel}</span>
          </motion.div>
        </div>
      </div>

      {/* Time-Bar at bottom */}
      <div className="relative z-30 border-t border-border bg-card/95 backdrop-blur-md px-4 py-4 md:px-8 md:py-5">
        {/* Year & era above slider */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAutoPlay}
              className="gap-2 text-secondary hover:text-secondary"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying
                ? (isAr ? "إيقاف" : "Pause")
                : (isAr ? "تشغيل تلقائي" : "Auto-Play")}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center">
            <motion.div
              key={currentYear}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <span className="font-serif-display text-2xl md:text-3xl font-bold text-secondary gold-glow rounded-lg px-3">
                {currentYear} {isAr ? "م" : "CE"}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">{eraLabel}</span>
            </motion.div>
          </div>
          <div className="text-xs text-muted-foreground w-24 text-end">
            {events.filter((e) => e.year_ce <= currentYear).length} {isAr ? "حدث" : "events"}
          </div>
        </div>

        {/* Gold slider */}
        <div className="relative">
          {/* Event tick marks */}
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
        onRelatedEventClick={(id) => {
          setDetailModalOpen(false);
          setTimeout(() => openEventDetail(id), 300);
        }}
      />
    </div>
  );
};

export default InteractiveJourneyPage;
