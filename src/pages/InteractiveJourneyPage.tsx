import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronRight, Gauge, Volume2, VolumeX, Mic, Maximize, Minimize, Keyboard, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import EventDetailModal, { type EventDetailData, type RelatedEvent } from "@/components/EventDetailModal";
import EventsSidebar from "@/components/journey/EventsSidebar";
import { categories } from "@/data/eventCategories";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const MIN_YEAR = 570;
const MAX_YEAR = 632;
const SPEED_PRESETS = [
  { label: "0.5×", labelAr: "٠.٥×", ms: 10000 },
  { label: "1×", labelAr: "١×", ms: 6000 },
  { label: "2×", labelAr: "٢×", ms: 3000 },
  { label: "3×", labelAr: "٣×", ms: 1500 },
];
const ARABIA_CENTER: L.LatLngExpression = [23.5, 39.5];

const MAJOR_YEAR_LABELS = [
  { year: 570, labelAr: "المولد", labelEn: "Birth" },
  { year: 610, labelAr: "الوحي", labelEn: "Revelation" },
  { year: 622, labelAr: "الهجرة", labelEn: "Hijrah" },
  { year: 624, labelAr: "بدر", labelEn: "Badr" },
  { year: 630, labelAr: "فتح مكة", labelEn: "Conquest" },
  { year: 632, labelAr: "الوفاة", labelEn: "Farewell" },
];

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
  audio_url: string | null;
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

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const InteractiveJourneyPage = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [currentYear, setCurrentYear] = useState(MIN_YEAR);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const intervalRef = useRef<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.MarkerClusterGroup | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);
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

  // New state for enhancements
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(categories.map(c => c.id)));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupTimeoutRef = useRef<number | null>(null);
  const prevYearRef = useRef(MIN_YEAR);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.8);
  const [autoNarrate, setAutoNarrate] = useState(false);
  const [currentAudioEventId, setCurrentAudioEventId] = useState<string | null>(null);
  const waitingForAudioRef = useRef(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioProgressRaf = useRef<number | null>(null);

  // Progress calculation
  const progressPercent = Math.round(((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100);

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

  // Filtered & visible events
  const filteredEvents = useMemo(() => {
    return events.filter(e => activeCategories.has(e.category));
  }, [events, activeCategories]);

  const visibleEvents = useMemo(() => {
    const pastEvents = filteredEvents.filter((e) => e.year_ce <= currentYear);
    const uniqueYears = [...new Set(pastEvents.map((e) => e.year_ce))].sort((a, b) => b - a);
    const recentYears = uniqueYears.slice(0, 3);
    return pastEvents.filter((e) => recentYears.includes(e.year_ce));
  }, [filteredEvents, currentYear]);

  const currentYearEvents = useMemo(() => filteredEvents.filter((e) => e.year_ce === currentYear), [filteredEvents, currentYear]);

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

    pathAnimationsRef.current.forEach((id) => cancelAnimationFrame(id));
    pathAnimationsRef.current = [];
    animatedDotsRef.current.forEach((m) => m.remove());
    animatedDotsRef.current = [];
    trailLinesRef.current.forEach((l) => l.remove());
    trailLinesRef.current = [];

    visibleEvents.forEach((event) => {
      const isCurrentYr = event.year_ce === currentYear;
      const icon = createCategoryIcon(event.category, event.is_major, isCurrentYr);
      const marker = L.marker([event.lat, event.lng], { icon });

      const title = isAr ? event.title : event.title_en;


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

    // Animated polylines
    const matchedEvents = visibleEvents.filter((e) => e.path_id);
    const pathIds = [...new Set(matchedEvents.map((e) => e.path_id))];
    const activePaths = paths.filter((p: any) => pathIds.includes(p.id));

    const animatePathLine = (positions: L.LatLngTuple[], pathColor: string, isSea: boolean, labelText?: string) => {
      if (positions.length < 2) return;

      const trail = L.polyline(positions, {
        color: pathColor, weight: 8, opacity: 0.15, lineCap: "round", lineJoin: "round",
        dashArray: isSea ? "8 6" : undefined,
      });
      trail.addTo(polylinesLayer);
      trailLinesRef.current.push(trail);

      const mainLine = L.polyline(positions, {
        color: pathColor, weight: 4, opacity: 0.9, lineCap: "round", lineJoin: "round",
        dashArray: isSea ? "8 6" : undefined,
      });
      mainLine.addTo(polylinesLayer);

      requestAnimationFrame(() => {
        const el = (mainLine as any)._path as SVGPathElement | undefined;
        if (el) {
          const totalLength = el.getTotalLength();
          el.style.strokeDasharray = `${totalLength}`;
          el.style.strokeDashoffset = `${totalLength}`;
          el.style.transition = "stroke-dashoffset 2s ease-in-out";
          requestAnimationFrame(() => { el.style.strokeDashoffset = "0"; });
        }
      });

      const dotIcon = L.divIcon({
        html: `<div class="journey-glow-dot" style="--dot-color: ${pathColor};"></div>`,
        className: "", iconSize: [14, 14], iconAnchor: [7, 7],
      });
      const dotMarker = L.marker(positions[0], { icon: dotIcon, interactive: false });
      dotMarker.addTo(map);
      animatedDotsRef.current.push(dotMarker);

      const distances: number[] = [0];
      for (let i = 1; i < positions.length; i++) {
        distances.push(distances[i - 1] + map.distance(positions[i - 1], positions[i]));
      }
      const totalDist = distances[distances.length - 1];
      if (totalDist === 0) return;

      const LOOP_DURATION = 5000;
      let startTime: number | null = null;
      let showedLabel = false;

      const animateDot = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = (elapsed % LOOP_DURATION) / LOOP_DURATION;
        const currentDist = progress * totalDist;

        let segIdx = 0;
        for (let i = 1; i < distances.length; i++) {
          if (distances[i] >= currentDist) { segIdx = i - 1; break; }
          if (i === distances.length - 1) segIdx = i - 1;
        }
        const segLen = distances[segIdx + 1] - distances[segIdx];
        const t = segLen > 0 ? (currentDist - distances[segIdx]) / segLen : 0;
        const lat = positions[segIdx][0] + t * (positions[segIdx + 1][0] - positions[segIdx][0]);
        const lng = positions[segIdx][1] + t * (positions[segIdx + 1][1] - positions[segIdx][1]);
        dotMarker.setLatLng([lat, lng]);

        if (!showedLabel && labelText && elapsed >= LOOP_DURATION) {
          showedLabel = true;
          const midIdx = Math.floor(positions.length / 2);
          const popup = L.popup({ closeButton: false, autoClose: true, className: "seerah-path-label", offset: [0, -10] })
            .setLatLng(positions[midIdx])
            .setContent(`<span style="font-size:12px;font-weight:600;">${labelText}</span>`)
            .openOn(map);
          setTimeout(() => map.closePopup(popup), 3000);
        }

        const frameId = requestAnimationFrame(animateDot);
        pathAnimationsRef.current.push(frameId);
      };

      pathAnimationsRef.current.push(requestAnimationFrame(animateDot));
    };

    activePaths.forEach((p: any) => {
      const steps = (p.path_steps || []).sort((a: any, b: any) => a.step_order - b.step_order);
      const positions: L.LatLngTuple[] = steps.map((s: any) => [s.lat || 21.4225, s.lng || 39.8262] as L.LatLngTuple);
      const pathColor = `hsl(${p.line_color})`;
      const isSea = steps.some((s: any) => s.segment_type === "sea");
      const label = isAr ? p.name : p.name_en;
      animatePathLine(positions, pathColor, isSea, label);
    });

    const sortedVisible = [...visibleEvents].sort((a, b) => a.year_ce - b.year_ce || a.display_order - b.display_order);
    const eventsWithPathIds = new Set(matchedEvents.map((e) => e.id));
    const journeyPositions: L.LatLngTuple[] = [];
    sortedVisible.forEach((ev) => {
      if (eventsWithPathIds.has(ev.id)) return;
      const pos: L.LatLngTuple = [ev.lat, ev.lng];
      const last = journeyPositions[journeyPositions.length - 1];
      if (!last || Math.abs(last[0] - pos[0]) > 0.05 || Math.abs(last[1] - pos[1]) > 0.05) {
        journeyPositions.push(pos);
      }
    });

    if (journeyPositions.length >= 2) {
      const journeyColor = "hsl(var(--primary))";
      animatePathLine(journeyPositions, journeyColor, false);
    }

    if (currentYearEvents.length > 0) {
      const bounds = L.latLngBounds(currentYearEvents.map((e) => [e.lat, e.lng] as L.LatLngExpression));
      if (bounds.isValid()) {
        map.flyToBounds(bounds.pad(0.5), { duration: 1, maxZoom: 10 });
      }
    }
  }, [visibleEvents, currentYear, isAr, paths, currentYearEvents]);

  // Mini popup on year change during autoplay
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isPlaying || currentYear === prevYearRef.current) {
      prevYearRef.current = currentYear;
      return;
    }
    prevYearRef.current = currentYear;

    if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);

    const yearEvents = currentYearEvents;
    if (yearEvents.length === 0) return;

    const firstEvent = yearEvents[0];
    const title = isAr ? firstEvent.title : firstEvent.title_en;
    const catIcon = categoryIcons[firstEvent.category] || "⭐";
    const popup = L.popup({
      closeButton: false,
      autoClose: false,
      className: "seerah-mini-popup",
      offset: [0, -20],
    })
      .setLatLng([firstEvent.lat, firstEvent.lng])
      .setContent(`
        <div style="text-align:center;padding:2px 4px;">
          <div style="font-size:16px;">${catIcon}</div>
          <div style="font-size:12px;font-weight:600;margin:2px 0;">${title}</div>
          <div style="font-size:10px;opacity:0.7;">${currentYear} ${isAr ? "م" : "CE"}</div>
        </div>
      `)
      .openOn(map);

    popupTimeoutRef.current = window.setTimeout(() => {
      map.closePopup(popup);
    }, 3000);
  }, [currentYear, isPlaying, currentYearEvents, isAr]);

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
    waitingForAudioRef.current = false;
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  // Audio playback helpers
  const updateAudioProgress = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      setAudioProgress(audioRef.current.currentTime);
      setAudioDuration(audioRef.current.duration || 0);
      audioProgressRaf.current = requestAnimationFrame(updateAudioProgress);
    }
  }, []);

  const playAudio = useCallback((url: string, eventId: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("ended", () => {
        setAudioPlaying(false);
        setCurrentAudioEventId(null);
        setAudioProgress(0);
        setAudioDuration(0);
        if (audioProgressRaf.current) cancelAnimationFrame(audioProgressRaf.current);
        if (waitingForAudioRef.current) {
          waitingForAudioRef.current = false;
        }
      });
      audioRef.current.addEventListener("loadedmetadata", () => {
        setAudioDuration(audioRef.current?.duration || 0);
      });
    }
    const audio = audioRef.current;
    audio.src = url;
    audio.volume = audioMuted ? 0 : audioVolume;
    audio.play().then(() => {
      if (audioProgressRaf.current) cancelAnimationFrame(audioProgressRaf.current);
      audioProgressRaf.current = requestAnimationFrame(updateAudioProgress);
    }).catch(() => {});
    setAudioPlaying(true);
    setAudioProgress(0);
    setCurrentAudioEventId(eventId);
  }, [audioMuted, audioVolume, updateAudioProgress]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioPlaying(false);
    setCurrentAudioEventId(null);
    waitingForAudioRef.current = false;
  }, []);

  const toggleAudioPause = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        audioProgressRaf.current = requestAnimationFrame(updateAudioProgress);
      }).catch(() => {});
      setAudioPlaying(true);
    } else {
      audioRef.current.pause();
      if (audioProgressRaf.current) cancelAnimationFrame(audioProgressRaf.current);
      setAudioPlaying(false);
    }
  }, [updateAudioProgress]);

  // Sync volume/mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioMuted ? 0 : audioVolume;
    }
  }, [audioVolume, audioMuted]);

  // Auto-narrate
  useEffect(() => {
    if (!autoNarrate) return;
    const firstWithAudio = currentYearEvents.find((e) => e.audio_url);
    if (firstWithAudio?.audio_url) {
      playAudio(firstWithAudio.audio_url, firstWithAudio.id);
    }
  }, [currentYear, autoNarrate, currentYearEvents, playAudio]);

  const autoplayInterval = SPEED_PRESETS[speedIndex].ms;

  useEffect(() => {
    if (!isPlaying) return;
    const yearEvents = [...new Set(filteredEvents.map((e) => e.year_ce))].sort((a, b) => a - b);
    let idx = yearEvents.findIndex((y) => y >= currentYear);
    if (idx < 0) idx = 0;
    intervalRef.current = window.setInterval(() => {
      idx++;
      if (idx >= yearEvents.length) { stopPlaying(); return; }
      setCurrentYear(yearEvents[idx]);
    }, autoplayInterval);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, filteredEvents, stopPlaying, autoplayInterval]);

  const cycleSpeed = () => {
    setSpeedIndex((prev) => (prev + 1) % SPEED_PRESETS.length);
  };

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

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Category filter toggle
  const toggleCategory = useCallback((catId: string) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        if (next.size > 1) next.delete(catId); // keep at least one
      } else {
        next.add(catId);
      }
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          handleAutoPlay();
          break;
        case "ArrowRight": {
          e.preventDefault();
          const yearList = [...new Set(filteredEvents.map(ev => ev.year_ce))].sort((a, b) => a - b);
          const nextIdx = yearList.findIndex(y => y > currentYear);
          if (nextIdx >= 0) { stopPlaying(); setCurrentYear(yearList[nextIdx]); }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          const yearList = [...new Set(filteredEvents.map(ev => ev.year_ce))].sort((a, b) => a - b);
          const prevIdx = [...yearList].reverse().findIndex(y => y < currentYear);
          if (prevIdx >= 0) { stopPlaying(); setCurrentYear([...yearList].reverse()[prevIdx]); }
          break;
        }
        case "m":
        case "M":
          setAudioMuted(prev => !prev);
          break;
        case "Escape":
          if (showShortcuts) setShowShortcuts(false);
          else if (sidebarOpen) setSidebarOpen(false);
          break;
        case "?":
          setShowShortcuts(prev => !prev);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentYear, filteredEvents, isPlaying, sidebarOpen, showShortcuts, stopPlaying, toggleFullscreen]);

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
    <div ref={containerRef} className="flex flex-col bg-background overflow-hidden pt-16 md:pt-20" dir={isAr ? "rtl" : "ltr"} style={{ height: "100vh" }}>
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
        .journey-glow-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--dot-color, hsl(46 56% 52%));
          border: 2px solid rgba(255,255,255,0.9);
          box-shadow: 0 0 10px var(--dot-color, hsl(46 56% 52%)),
                      0 0 20px var(--dot-color, hsl(46 56% 52%)),
                      0 0 4px rgba(255,255,255,0.6);
          animation: dot-glow 1.5s ease-in-out infinite;
        }
        @keyframes dot-glow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.85; }
        }
        .seerah-path-label .leaflet-popup-content-wrapper,
        .seerah-mini-popup .leaflet-popup-content-wrapper {
          background: hsl(var(--card) / 0.95);
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          padding: 4px 10px;
        }
        .seerah-path-label .leaflet-popup-tip,
        .seerah-mini-popup .leaflet-popup-tip {
          background: hsl(var(--card) / 0.95);
          border: 1px solid hsl(var(--border));
        }
        .seerah-path-label .leaflet-popup-content,
        .seerah-mini-popup .leaflet-popup-content {
          margin: 4px 2px;
          color: hsl(var(--foreground));
        }
        .seerah-mini-popup {
          animation: popup-fade-in 0.3s ease-out;
        }
        @keyframes popup-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
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

        {/* Era indicator + Progress */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
          <motion.div key={era} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-sm">
            <span className="text-sm font-medium text-foreground">{eraLabel}</span>
          </motion.div>
          <div className="px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-sm flex items-center gap-2">
            <Progress value={progressPercent} className="h-1.5 w-16 bg-muted" />
            <span className="text-[10px] text-muted-foreground font-mono">{progressPercent}%</span>
          </div>
        </div>

        {/* Top-right controls: fullscreen + shortcuts help */}
        <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2" style={fetchError || isLoadingData ? { top: "3.5rem" } : {}}>
          <Button size="sm" variant="ghost" onClick={() => setShowShortcuts(!showShortcuts)} className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm border border-border" title={isAr ? "اختصارات لوحة المفاتيح (?)" : "Keyboard shortcuts (?)"}>
            <Keyboard className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={toggleFullscreen} className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm border border-border" title={isAr ? "ملء الشاشة (F)" : "Fullscreen (F)"}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>

        {/* Keyboard shortcuts overlay */}
        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-[1100] flex items-center justify-center bg-background/60 backdrop-blur-sm"
              onClick={() => setShowShortcuts(false)}
            >
              <div className="bg-card border border-border rounded-xl shadow-xl p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{isAr ? "اختصارات لوحة المفاتيح" : "Keyboard Shortcuts"}</h3>
                  <Button size="sm" variant="ghost" onClick={() => setShowShortcuts(false)} className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    ["Space", isAr ? "تشغيل / إيقاف" : "Play / Pause"],
                    ["← →", isAr ? "الحدث السابق / التالي" : "Previous / Next event"],
                    ["M", isAr ? "كتم / إلغاء كتم الصوت" : "Mute / Unmute"],
                    ["F", isAr ? "ملء الشاشة" : "Fullscreen"],
                    ["Esc", isAr ? "إغلاق" : "Close panel"],
                    ["?", isAr ? "إظهار الاختصارات" : "Show shortcuts"],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex items-center justify-between">
                      <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono text-foreground">{key}</kbd>
                      <span className="text-muted-foreground">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events Sidebar */}
        <EventsSidebar
          events={sidebarEvents}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onEventClick={openEventDetail}
          title={sidebarTitle}
          onPlayAudio={(url, eventId) => playAudio(url, eventId)}
          currentAudioEventId={currentAudioEventId}
          audioPlaying={audioPlaying}
        />
      </div>

      {/* Time-Bar */}
      <div className="relative z-[1000] border-t border-border bg-card/95 backdrop-blur-md px-3 py-3 md:px-8 md:py-5">
        {/* Category filter chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map(cat => {
            const isActive = activeCategories.has(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                  isActive
                    ? "border-transparent text-white shadow-sm"
                    : "border-border text-muted-foreground bg-muted/50 opacity-50"
                }`}
                style={isActive ? { backgroundColor: `hsl(${cat.colorHsl})` } : {}}
              >
                {categoryIcons[cat.id]} {isAr ? cat.label : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Controls row - responsive */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Button size="sm" variant="ghost" onClick={handleAutoPlay} className="gap-1.5 text-secondary hover:text-secondary text-xs md:text-sm">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="hidden sm:inline">{isPlaying ? (isAr ? "إيقاف" : "Pause") : (isAr ? "تشغيل" : "Play")}</span>
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset} className="h-8 w-8 p-0 md:h-auto md:w-auto md:px-3">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={cycleSpeed}
              className="gap-1 text-[10px] md:text-xs min-w-[50px] font-mono"
            >
              <Gauge className="h-3.5 w-3.5" />
              {isAr ? SPEED_PRESETS[speedIndex].labelAr : SPEED_PRESETS[speedIndex].label}
            </Button>
            {/* Audio controls */}
            <div className="flex items-center gap-1.5 border-s border-border ps-2 ms-0.5">
              {audioPlaying ? (
                <Button size="sm" variant="ghost" onClick={toggleAudioPause} className="h-7 w-7 p-0">
                  <Pause className="h-3.5 w-3.5" />
                </Button>
              ) : currentAudioEventId ? (
                <Button size="sm" variant="ghost" onClick={toggleAudioPause} className="h-7 w-7 p-0">
                  <Play className="h-3.5 w-3.5" />
                </Button>
              ) : null}
              <Button size="sm" variant="ghost" onClick={() => setAudioMuted(!audioMuted)} className="h-7 w-7 p-0">
                {audioMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </Button>
              <div className="hidden sm:flex items-center gap-1.5 w-16">
                <Slider
                  value={[audioVolume * 100]}
                  onValueChange={(value) => {
                    const vol = value[0] / 100;
                    setAudioVolume(vol);
                    if (audioRef.current) audioRef.current.volume = vol;
                    if (vol > 0 && audioMuted) setAudioMuted(false);
                  }}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              <Button
                size="sm"
                variant={autoNarrate ? "default" : "outline"}
                onClick={() => setAutoNarrate(!autoNarrate)}
                className="h-7 gap-1 text-[10px] px-2"
              >
                <Mic className="h-3 w-3" />
                <span className="hidden sm:inline">{isAr ? "سرد" : "Narrate"}</span>
              </Button>
              {/* Audio progress bar */}
              {currentAudioEventId && audioDuration > 0 && (
                <div className="hidden md:flex items-center gap-1.5 border-s border-border ps-2 ms-0.5">
                  <div
                    className="relative h-1.5 w-20 rounded-full bg-muted overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      if (!audioRef.current || !audioDuration) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = (e.clientX - rect.left) / rect.width;
                      audioRef.current.currentTime = pct * audioDuration;
                      setAudioProgress(pct * audioDuration);
                    }}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-secondary"
                      style={{ width: `${audioDuration > 0 ? (audioProgress / audioDuration) * 100 : 0}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono min-w-[32px]">
                    {formatTime(audioProgress)}/{formatTime(audioDuration)}
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Year display */}
          <motion.div key={currentYear} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
            <span className="font-serif-display text-xl md:text-3xl font-bold text-secondary gold-glow rounded-lg px-2">
              {currentYear} {isAr ? "م" : "CE"}
            </span>
          </motion.div>
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
               {isLoadingData ? "..." : currentYearEvents.length} {isAr ? "حدث" : "events"}
            </Button>
          </div>
        </div>

        {/* Timeline slider with year labels */}
        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 pointer-events-none">
            {filteredEvents.map((e) => {
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
          {/* Major event year labels */}
          <div className="relative h-5 mt-1">
            {MAJOR_YEAR_LABELS.map(({ year, labelAr, labelEn }) => {
              const pct = ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
              return (
                <button
                  key={year}
                  onClick={() => { stopPlaying(); setCurrentYear(year); }}
                  className={`absolute -translate-x-1/2 text-[9px] md:text-[10px] transition-colors cursor-pointer hover:text-foreground ${
                    currentYear === year ? "text-secondary font-bold" : "text-muted-foreground"
                  }`}
                  style={{ left: `${pct}%` }}
                >
                  {isAr ? labelAr : labelEn}
                </button>
              );
            })}
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
