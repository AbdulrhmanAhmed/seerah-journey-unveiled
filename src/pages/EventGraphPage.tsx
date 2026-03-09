import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Network, Search, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { categories, type EventCategory } from "@/data/eventCategories";
import EventRelationshipGraph from "@/components/EventRelationshipGraph";

const EventGraphPage = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight") || undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<EventCategory>>(
    new Set(categories.map((c) => c.id))
  );
  const [eraFilter, setEraFilter] = useState<"all" | "makkah" | "madinah">("all");

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

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (!activeCategories.has(e.category as EventCategory)) return false;
      if (eraFilter !== "all" && e.era !== eraFilter) return false;
      return true;
    });
  }, [events, activeCategories, eraFilter]);

  const toggleCategory = (cat: EventCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const categoryColors: Record<string, string> = {
    milestone: "hsl(46, 56%, 52%)",
    battle: "hsl(0, 72%, 50%)",
    contract: "hsl(200, 60%, 50%)",
    challenge: "hsl(30, 80%, 50%)",
    marriage: "hsl(330, 60%, 55%)",
    diplomacy: "hsl(160, 50%, 40%)",
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
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

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 space-y-3"
        >
          {/* Search + Era Toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن حدث..." : "Search events..."}
                className="w-full ps-9 pe-8 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Era Toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden bg-card">
              {([
                { value: "all" as const, label: isAr ? "الكل" : "All" },
                { value: "makkah" as const, label: isAr ? "مكي" : "Makkan" },
                { value: "madinah" as const, label: isAr ? "مدني" : "Madinan" },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setEraFilter(opt.value)}
                  className={`px-4 py-2 text-xs font-body font-medium transition-all ${
                    eraFilter === opt.value
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategories.has(cat.id);
              const color = categoryColors[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-all ${
                    isActive
                      ? "border-transparent text-white shadow-sm"
                      : "border-border text-muted-foreground bg-card hover:bg-muted/50"
                  }`}
                  style={isActive ? { backgroundColor: color } : undefined}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white/70" : ""}`}
                    style={!isActive ? { backgroundColor: color } : undefined}
                  />
                  {isAr ? cat.label : cat.labelEn}
                </button>
              );
            })}
          </div>
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
              events={filteredEvents}
              highlightEventId={highlightId}
              searchQuery={searchQuery}
            />

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                {
                  label: isAr ? "إجمالي الأحداث" : "Total Events",
                  value: filteredEvents.length,
                },
                {
                  label: isAr ? "أحداث مترابطة" : "Connected",
                  value: filteredEvents.filter((e) => e.related_event_ids.length > 0).length,
                },
                {
                  label: isAr ? "العهد المكي" : "Makkan",
                  value: filteredEvents.filter((e) => e.era === "makkah").length,
                },
                {
                  label: isAr ? "العهد المدني" : "Madinan",
                  value: filteredEvents.filter((e) => e.era === "madinah").length,
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
