import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { timelineEvents } from "@/data/seerahTimeline";
import type { TimelineEvent } from "@/data/seerahTimeline";
import TimelineEventCard from "@/components/TimelineEventCard";
import TimelineEventModal from "@/components/TimelineEventModal";
import YearQuickNav from "@/components/YearQuickNav";
import { supabase } from "@/integrations/supabase/client";

const JourneyPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleLearnMore = useCallback(async (event: TimelineEvent) => {
    // Try to find a matching DB event by title to get its ID
    const { data } = await supabase
      .from("timeline_events")
      .select("id")
      .or(`title.eq.${event.title},title_en.eq.${event.titleEn}`)
      .limit(1)
      .maybeSingle();

    if (data) {
      navigate(`/event/${data.id}`);
    } else {
      // Fallback to simple modal
      setSelectedEvent(event);
      setModalOpen(true);
    }
  }, [navigate]);

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

  const madinahStartIndex = timelineEvents.findIndex((e) => e.era === "madinah");
  const makkahEvents = timelineEvents.slice(0, madinahStartIndex);
  const madinahEvents = timelineEvents.slice(madinahStartIndex);

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
            <p className="text-muted-foreground font-body">
              {t("journeySubtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative" ref={timelineRef}>
        <YearQuickNav />

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
                index={i + madinahStartIndex}
                onLearnMore={handleLearnMore}
              />
            ))}
          </div>
        </section>
      </div>

      <TimelineEventModal
        event={selectedEvent}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default JourneyPage;
