import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Filter } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TimelineEvent } from "@/data/seerahTimeline";
import TimelineEventCard from "@/components/TimelineEventCard";
import TimelineEventModal from "@/components/TimelineEventModal";
import { Skeleton } from "@/components/ui/skeleton";

const JourneyPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["journey-events", showAll],
    queryFn: async () => {
      let query = supabase
        .from("timeline_events")
        .select("*")
        .eq("is_active", true)
        .order("year_ce", { ascending: true })
        .order("display_order", { ascending: true });

      if (!showAll) {
        query = query.eq("is_major", true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((e): TimelineEvent => ({
        id: e.slug || e.id,
        year: `${e.year_ce} م`,
        yearEn: `${e.year_ce} CE`,
        hijriYear: e.year_hijri || undefined,
        hijriYearEn: e.year_hijri || undefined,
        title: e.title,
        titleEn: e.title_en,
        summary: e.description || "",
        summaryEn: e.description_en || "",
        details: e.full_story || "",
        detailsEn: e.full_story_en || "",
        era: (e.era === "madinah" ? "madinah" : "makkah") as "makkah" | "madinah",
        category: e.category as TimelineEvent["category"],
      }));
    },
  });

  const handleLearnMore = useCallback(
    (event: TimelineEvent) => {
      navigate(`/event/${event.id}`);
    },
    [navigate],
  );

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const timelineHeight = timelineRef.current.scrollHeight;
      const viewportCenter = window.innerHeight / 2;
      const scrolled = viewportCenter - rect.top;
      const progress = Math.min(Math.max(scrolled / timelineHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const madinahStartIndex = events.findIndex((e) => e.era === "madinah");
  const makkahEvents = madinahStartIndex >= 0 ? events.slice(0, madinahStartIndex) : events;
  const madinahEvents = madinahStartIndex >= 0 ? events.slice(madinahStartIndex) : [];

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-12 islamic-pattern">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
              <Clock size={28} className="text-secondary" />
            </div>
            <h1 className="font-serif-display text-4xl md:text-5xl text-foreground mb-4">
              {t("journeyTitle")}
            </h1>
            <p className="text-muted-foreground font-body mb-6">
              {t("journeySubtitle")}
            </p>

            {/* Toggle: Important / All Events */}
            <div className="inline-flex items-center gap-1 bg-muted/60 backdrop-blur-sm rounded-full p-1 border border-border">
              <button
                onClick={() => setShowAll(false)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                  !showAll
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Filter size={14} />
                {t("journeyImportantEvents")}
              </button>
              <button
                onClick={() => setShowAll(true)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                  showAll
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("journeyAllEvents")}
                <span className="text-xs opacity-70">({events.length})</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {isLoading ? (
        <div className="container mx-auto px-4 md:px-6 py-16 space-y-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <div className="w-full md:w-[45%] space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative" ref={timelineRef}>
          {makkahEvents.length > 0 && (
            <section
              className="relative py-12 md:py-16 transition-colors duration-700"
              style={{
                background: "linear-gradient(180deg, hsl(48 44% 95%) 0%, hsl(48 40% 92%) 100%)",
              }}
            >
              <div className="container mx-auto px-4 md:px-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <span className="inline-block font-body text-xs font-semibold uppercase tracking-[0.2em] text-secondary bg-secondary/10 px-4 py-1.5 rounded-full">
                    {t("journeyMakkahEra")}
                  </span>
                </motion.div>

                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border">
                  <div
                    className="w-full bg-secondary transition-[height] duration-100 ease-linear"
                    style={{ height: `${Math.min(scrollProgress * 200, 100)}%` }}
                  />
                </div>

                {makkahEvents.map((event, i) => (
                  <TimelineEventCard
                    key={event.id}
                    event={event}
                    index={i}
                    onLearnMore={handleLearnMore}
                  />
                ))}
              </div>
            </section>
          )}

          {madinahEvents.length > 0 && (
            <section
              className="relative py-12 md:py-16 transition-colors duration-700"
              style={{
                background: "linear-gradient(180deg, hsl(160 40% 93%) 0%, hsl(160 50% 90%) 100%)",
              }}
            >
              <div className="container mx-auto px-4 md:px-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <span className="inline-block font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                    {t("journeyMadinahEra")}
                  </span>
                </motion.div>

                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border">
                  <div
                    className="w-full bg-secondary transition-[height] duration-100 ease-linear"
                    style={{
                      height: `${Math.min(Math.max((scrollProgress - 0.5) * 200, 0), 100)}%`,
                    }}
                  />
                </div>

                {madinahEvents.map((event, i) => (
                  <TimelineEventCard
                    key={event.id}
                    event={event}
                    index={i + (madinahStartIndex >= 0 ? madinahStartIndex : 0)}
                    onLearnMore={handleLearnMore}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <TimelineEventModal
        event={selectedEvent}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default JourneyPage;
