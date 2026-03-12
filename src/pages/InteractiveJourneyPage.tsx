import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import EventDetailModal, { type EventDetailData, type RelatedEvent } from "@/components/EventDetailModal";
import EventsSidebar from "@/components/journey/EventsSidebar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MIN_YEAR = 570;
const MAX_YEAR = 632;
const AUTOPLAY_INTERVAL = 3000;
const ARABIA_CENTER: L.LatLngExpression = [23.5, 39.5];

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
  lat: number;
  lng: number;
  is_major: boolean;
  timeline_visible: boolean;
  display_order: number;
}

const categoryColors: Record<string, string> = {
  milestone: "#E6B422",
  battle: "#EF4444",
  contract: "#60A5FA",
  challenge: "#F97316",
  marriage: "#F472B6",
  diplomacy: "#34D399",
};

const categoryColorsHsl: Record<string, string> = {
  milestone: "46 56% 52%",
  battle: "0 72% 50%",
  contract: "200 60% 50%",
  challenge: "30 80% 50%",
  marriage: "330 60% 55%",
  diplomacy: "160 50% 40%",
};

const categoryIcons: Record<string, string> = {
  milestone: "⭐",
  battle: "⚔️",
  contract: "📜",
  challenge: "🔥",
  marriage: "💍",
  diplomacy: "🕊️",
};

function createCategoryIcon(category: string, isMajor: boolean, isCurrentYear: boolean) {
  const color = categoryColors[category] || "#C6A020";
  const icon = categoryIcons[category] || "⭐";
  const size = isMajor && isCurrentYear ? 36 : isCurrentYear ? 30 : 24;
  const pulse = isCurrentYear ? "animation: marker-pulse 2s infinite;" : "";

  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      background:${color};border:2.5px solid #fff;
      border-radius:50%;box-shadow:0 2px 12px rgba(0,0,0,0.4), 0 0 6px ${color}80;
      font-size:${size * 0.45}px;cursor:pointer;
      ${pulse}
    ">${icon}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const InteractiveJourneyPage = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [currentYear, setCurrentYear] = useState(MIN_YEAR);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);
  const pathAnimationsRef = useRef<number[]>([]);
  const animatedDotsRef = useRef<L.Marker[]>([]);
  const trailLinesRef = useRef<L.Polyline[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [paths, setPaths] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<EventDetailData | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<RelatedEvent[]>([]);
  const [sidebarEvents, setSidebarEvents] = useState<TimelineEvent[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTitle, setSidebarTitle] = useState("");

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: ARABIA_CENTER,
      zoom: 6,
      minZoom: 5,
      maxZoom: 16,
      maxBounds: [[0, 25], [40, 60]],
      maxBoundsViscosity: 1.0,
      zoomControl: true,
      worldCopyJump: false,
    });

    // Antique-style tiles with sepia filter
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png", {
      pane: "overlayPane",
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    const polylinesLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;
    polylinesLayerRef.current = polylinesLayer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Load data
  useEffect(() => {
    let mounted = true;
    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => abortController.abort(), 12000);

    const loadData = async () => {
      try {
        setFetchError(false);

        const [eventsResp, pathsResp] = await Promise.all([
          supabase
            .from("timeline_events")
            .select("*")
            .eq("is_active", true)
            .eq("timeline_visible", true)
            .order("display_order")
            .abortSignal(abortController.signal),
          supabase
            .from("paths")
            .select("*, path_steps(*)")
            .eq("is_active", true)
            .order("created_at")
            .abortSignal(abortController.signal),
        ]);

        if (!mounted) return;

        if (eventsResp.error) {
          console.error("[InteractiveJourneyPage] Failed to load timeline events:", eventsResp.error.message);
          setFetchError(true);
        } else {
          setEvents((eventsResp.data ?? []) as TimelineEvent[]);
        }

        if (pathsResp.error) {
          console.error("[InteractiveJourneyPage] Failed to load paths:", pathsResp.error.message);
          setFetchError(true);
        } else {
          setPaths((pathsResp.data ?? []) as any[]);
        }

        console.log(
          "[InteractiveJourneyPage] Loaded",
          (eventsResp.data ?? []).length,
          "events and",
          (pathsResp.data ?? []).length,
          "paths"
        );
      } catch (error) {
        if (!mounted) return;
        const isAbort = error instanceof DOMException && error.name === "AbortError";
        console.error(
          isAbort ? "[InteractiveJourneyPage] Request timed out" : "[InteractiveJourneyPage] Unexpected load error:",
          error
        );
        setFetchError(true);
      } finally {
        window.clearTimeout(timeoutId);
        if (mounted) setIsLoadingData(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
      window.clearTimeout(timeoutId);
      abortController.abort();
    };
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

  // Update markers when visibleEvents or year changes
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    const polylinesLayer = polylinesLayerRef.current;
    const map = mapInstanceRef.current;
    if (!markersLayer || !polylinesLayer || !map) return;

    markersLayer.clearLayers();
    polylinesLayer.clearLayers();

    // Add markers
    visibleEvents.forEach((event) => {
      const isCurrentYr = event.year_ce === currentYear;
      const icon = createCategoryIcon(event.category, event.is_major, isCurrentYr);
      const marker = L.marker([event.lat, event.lng], { icon });

      const title = isAr ? event.title : event.title_en;
      marker.bindTooltip(title, {
        direction: "top",
        offset: [0, -14],
        className: "seerah-tooltip",
        permanent: true,
      });

      marker.on("click", () => {
        const locationEvents = visibleEvents.filter(
          (e) => Math.abs(e.lat - event.lat) < 0.1 && Math.abs(e.lng - event.lng) < 0.1
        );
        setSidebarEvents(locationEvents.length > 0 ? locationEvents : [event]);
        setSidebarTitle(
          locationEvents.length > 1
            ? `${locationEvents.length} ${isAr ? "أحداث" : "events"}`
            : title
        );
        setSidebarOpen(true);
      });

      marker.addTo(markersLayer);
    });

    // Add polylines for active paths
    const matchedEvents = visibleEvents.filter((e) => e.path_id);
    const pathIds = [...new Set(matchedEvents.map((e) => e.path_id))];
    const activePaths = paths.filter((p: any) => pathIds.includes(p.id));

    activePaths.forEach((p: any) => {
      const steps = (p.path_steps || []).sort((a: any, b: any) => a.step_order - b.step_order);
      if (steps.length < 2) return;
      const positions: L.LatLngExpression[] = steps.map((s: any) => [s.lat || 21.4225, s.lng || 39.8262] as L.LatLngExpression);
      const polyline = L.polyline(positions, {
        color: `hsl(${p.line_color})`,
        weight: 4,
        opacity: 0.9,
        dashArray: steps.some((s: any) => s.segment_type === "sea") ? "8 6" : undefined,
      });
      polyline.addTo(polylinesLayer);
    });

    // Auto-fly to current year's events
    if (currentYearEvents.length > 0) {
      const bounds = L.latLngBounds(currentYearEvents.map((e) => [e.lat, e.lng] as L.LatLngExpression));
      if (bounds.isValid()) {
        map.flyToBounds(bounds.pad(0.5), { duration: 1, maxZoom: 10 });
      }
    }
  }, [visibleEvents, currentYear, isAr, paths, currentYearEvents]);

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
    mapInstanceRef.current?.setView(ARABIA_CENTER, 6);
    setSidebarOpen(false);
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

  return (
    <div className="flex flex-col bg-background overflow-hidden pt-16 md:pt-20" dir={isAr ? "rtl" : "ltr"} style={{ height: "100vh" }}>
      <style>{`
        .seerah-tooltip {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          border-radius: 0.5rem;
          padding: 4px 10px;
          font-size: 13px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .seerah-tooltip::before { border-top-color: hsl(var(--border)) !important; }
        .leaflet-control-zoom {
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.5rem !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
          border-color: hsl(var(--border)) !important;
        }
        .leaflet-control-zoom a:hover { background: hsl(var(--muted)) !important; }
        @keyframes marker-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
          50% { transform: scale(1.15); box-shadow: 0 4px 16px rgba(198,160,32,0.5); }
        }
      `}</style>

      {/* Map container */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "100%",
            filter: "sepia(15%) saturate(110%) brightness(102%) contrast(105%)",
          }}
        />

        {/* Data status */}
        {isLoadingData && (
          <div className="absolute top-4 right-4 z-[1000] px-3 py-2 rounded-md bg-card/90 border border-border text-xs text-muted-foreground">
            {isAr ? "جارِ تحميل الأحداث..." : "Loading events..."}
          </div>
        )}

        {fetchError && !isLoadingData && (
          <div className="absolute top-4 right-4 z-[1000] px-3 py-2 rounded-md bg-card/95 border border-border text-xs text-foreground flex items-center gap-2">
            <span>{isAr ? "تعذر تحميل البيانات" : "Unable to load data"}</span>
            <button
              onClick={() => window.location.reload()}
              className="px-2 py-0.5 rounded bg-primary text-primary-foreground"
            >
              {isAr ? "إعادة المحاولة" : "Retry"}
            </button>
          </div>
        )}

        {/* Era indicator */}
        <div className="absolute top-4 left-4 z-[1000]">
          <motion.div key={era} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-sm">
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

      {/* Time-Bar */}
      <div className="relative z-[1000] border-t border-border bg-card/95 backdrop-blur-md px-4 py-4 md:px-8 md:py-5">
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
               {isLoadingData ? (isAr ? "..." : "...") : currentYearEvents.length} {isAr ? "حدث" : "events"}
            </Button>
          </div>
        </div>

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
                    backgroundColor: `hsl(${categoryColorsHsl[e.category] || "46 56% 52%"} / ${e.is_major ? 0.8 : 0.3})`,
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
