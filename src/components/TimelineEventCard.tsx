import { motion } from "framer-motion";
import { ChevronRight, Star, Swords, FileText, AlertCircle, Heart, Send } from "lucide-react";
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
  const isLeft = index % 2 === 0;

  return (
    <div
      id={`event-${event.id}`}
      className={`relative flex items-center w-full mb-12 md:mb-16 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col md:gap-0 gap-4`}
    >
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-0" : "md:pl-0"}`}
      >
        <div className="group relative rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5 md:p-6 shadow-sm hover:shadow-md hover:border-secondary/40 transition-all duration-300 cursor-pointer">
          {/* Era badge + Category badge */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`inline-block text-xs font-body font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                event.era === "makkah"
                  ? "bg-secondary/15 text-secondary"
                  : "bg-primary/15 text-primary"
              }`}
            >
              {event.era === "makkah" ? "Makkah Era" : "Madinah Era"}
            </span>
            {(() => {
              const cat = categoryMap[event.category];
              const CatIcon = iconMap[cat.icon];
              return (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-body font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `hsl(${cat.colorHsl} / 0.12)`,
                    color: `hsl(${cat.colorHsl})`,
                  }}
                >
                  {CatIcon && <CatIcon size={10} />}
                  {cat.label}
                </span>
              );
            })()}
          </div>

          {/* Date */}
          <p className="font-body text-sm text-muted-foreground mb-1">
            {event.year}
            {event.hijriYear && (
              <span className="ml-2 text-secondary">({event.hijriYear})</span>
            )}
          </p>

          {/* Title */}
          <h3 className="font-serif-display text-xl md:text-2xl text-foreground mb-2 leading-snug">
            {event.title}
          </h3>

          {/* Summary */}
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
            {event.summary}
          </p>

          {/* Learn More */}
          <button
            onClick={() => onLearnMore(event)}
            className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-secondary hover:text-secondary/80 transition-colors group/btn"
          >
            Learn More
            <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </motion.div>

      {/* Center dot on the timeline */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full border-2 border-secondary bg-background shadow-sm"
      />

      {/* Spacer for the other side */}
      <div className="hidden md:block w-[calc(50%-2rem)]" />
    </div>
  );
};

export default TimelineEventCard;
