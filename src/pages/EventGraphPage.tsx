import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Network } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import EventRelationshipGraph from "@/components/EventRelationshipGraph";

const EventGraphPage = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight") || undefined;

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["all-timeline-events-graph"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("id, title, title_en, slug, year_ce, era, category, related_event_ids")
        .eq("is_active", true)
        .order("year_ce")
        .order("display_order");
      if (error) throw error;
      return (data || []).map((e) => ({
        ...e,
        related_event_ids: (e.related_event_ids as string[]) || [],
      }));
    },
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            {isAr ? "العودة" : "Go Back"}
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Network size={20} className="text-secondary" />
            </div>
            <h1 className="font-serif-display text-3xl md:text-4xl text-foreground">
              {isAr ? "شبكة الأحداث" : "Event Network"}
            </h1>
          </div>
          <p className="font-body text-muted-foreground text-sm md:text-base max-w-2xl">
            {isAr
              ? "استكشف الروابط بين أحداث السيرة النبوية. مرّر فوق أي نقطة لرؤية التفاصيل، واضغط عليها للانتقال إلى صفحة الحدث."
              : "Explore how Seerah events connect to each other. Hover over any node for details, click to navigate to the event page."}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[500px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EventRelationshipGraph
              events={events}
              highlightEventId={highlightId}
            />

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                {
                  label: isAr ? "إجمالي الأحداث" : "Total Events",
                  value: events.length,
                },
                {
                  label: isAr ? "أحداث مترابطة" : "Connected Events",
                  value: events.filter((e) => e.related_event_ids.length > 0).length,
                },
                {
                  label: isAr ? "العهد المكي" : "Makkan Period",
                  value: events.filter((e) => e.era === "makkah").length,
                },
                {
                  label: isAr ? "العهد المدني" : "Madinan Period",
                  value: events.filter((e) => e.era === "madinah").length,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-4 rounded-xl bg-card border border-border"
                >
                  <p className="font-serif-display text-2xl text-secondary">{stat.value}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventGraphPage;
