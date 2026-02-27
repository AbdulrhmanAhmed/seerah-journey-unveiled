import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Swords, FileText, AlertCircle, Heart, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TimelineEvent } from "@/data/seerahTimeline";
import { categoryMap } from "@/data/eventCategories";

const iconMap: Record<string, React.ElementType> = {
  Star, Swords, FileText, AlertCircle, Heart, Send,
};

interface TimelineEventCardProps {
  event: TimelineEvent;
  index: number;
  onLearnMore: (event: TimelineEvent) => void;
}

const TimelineEventCard = ({ event, index, onLearnMore }: TimelineEventCardProps) => {
  const { lang, isRtl } = useLanguage();
  const isRight = index % 2 === 0;
  const Chevron = isRtl ? ChevronLeft : ChevronRight;

  const title = lang === "ar" ? event.title : event.titleEn;
  const summary = lang === "ar" ? event.summary : event.summaryEn;
  const year = lang === "ar" ? event.year : event.yearEn;
  const hijriYear = lang === "ar" ? event.hijriYear : event.hijriYearEn;
  const eraLabel = event.era === "makkah"
    ? (lang === "ar" ? "العهد المكي" : "Makkan Period")
    : (lang === "ar" ? "العهد المدني" : "Madinan Period");
  const readMore = lang === "ar" ? "اقرأ المزيد" : "Read More";

  const cat = categoryMap[event.category];
  const CatIcon = iconMap[cat.icon];
  const catLabel = lang === "ar" ? cat.label : cat.labelEn;

  return (
    <div
      id={`event-${event.id}`}
      className={`relative flex items-center w-full mb-12 md:mb-16 ${
        isRight ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col md:gap-0 gap-4`}
    >
      <motion.div
        initial={{ opacity: 0, x: isRight ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full md:w-[calc(50%-2rem)] ${isRight ? "md:pl-0" : "md:pr-0"}`}
      >
        <div className="group relative rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5 md:p-6 shadow-sm hover:shadow-md hover:border-secondary/40 transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`inline-block text-xs font-body font-semibold px-2.5 py-0.5 rounded-full ${
                event.era === "makkah"
                  ? "bg-secondary/15 text-secondary"
                  : "bg-primary/15 text-primary"
              }`}
            >
              {eraLabel}
            </span>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-body font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `hsl(${cat.colorHsl} / 0.12)`,
                color: `hsl(${cat.colorHsl})`,
              }}
            >
              {CatIcon && <CatIcon size={10} />}
              {catLabel}
            </span>
          </div>

          <p className="font-body text-sm text-muted-foreground mb-1">
            {year}
            {hijriYear && (
              <span className="me-2 text-secondary">({hijriYear})</span>
            )}
          </p>

          <h3 className="font-serif-display text-xl md:text-2xl text-foreground mb-2 leading-snug">
            {title}
          </h3>

          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
            {summary}
          </p>

          <button
            onClick={() => onLearnMore(event)}
            className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-secondary hover:text-secondary/80 transition-colors group/btn"
          >
            {readMore}
            <Chevron size={14} className="transition-transform group-hover/btn:-translate-x-0.5" />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full border-2 border-secondary bg-background shadow-sm"
      />

      <div className="hidden md:block w-[calc(50%-2rem)]" />
    </div>
  );
};

export default TimelineEventCard;
