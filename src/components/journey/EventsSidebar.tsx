import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ChevronRight, Volume2, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/i18n/LanguageContext";

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
  image_url: string | null;
  audio_url: string | null;
  map_x: number;
  map_y: number;
  is_major: boolean;
}

const categoryColors: Record<string, string> = {
  milestone: "46 56% 52%",
  battle: "0 72% 50%",
  contract: "200 60% 50%",
  challenge: "30 80% 50%",
  marriage: "330 60% 55%",
  diplomacy: "160 50% 40%",
};

const categoryLabels: Record<string, { ar: string; en: string }> = {
  milestone: { ar: "حدث بارز", en: "Milestone" },
  battle: { ar: "غزوة", en: "Battle" },
  contract: { ar: "عهد / صلح", en: "Treaty" },
  challenge: { ar: "ابتلاء", en: "Trial" },
  marriage: { ar: "زواج", en: "Marriage" },
  diplomacy: { ar: "دبلوماسية", en: "Diplomacy" },
};

interface EventsSidebarProps {
  events: TimelineEvent[];
  isOpen: boolean;
  onClose: () => void;
  onEventClick: (eventId: string) => void;
  title?: string;
  onPlayAudio?: (url: string, eventId: string) => void;
  currentAudioEventId?: string | null;
  audioPlaying?: boolean;
}

const EventsSidebar = ({ events, isOpen, onClose, onEventClick, title, onPlayAudio, currentAudioEventId, audioPlaying }: EventsSidebarProps) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: isAr ? -320 : 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: isAr ? -320 : 320, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-0 bottom-0 z-30 w-80 md:w-96 bg-card/95 backdrop-blur-xl border-border shadow-2xl flex flex-col"
          style={{ [isAr ? "left" : "right"]: 0 }}
          onWheelCapture={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <h3 className="font-serif-display text-lg font-bold text-foreground truncate">
              {title || (isAr ? "الأحداث" : "Events")}
            </h3>
            <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8 shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Event count */}
          <div className="px-4 py-2 text-xs text-muted-foreground font-body border-b border-border/50">
            {events.length} {isAr ? "حدث" : "event(s)"}
          </div>

          {/* Scrollable event list */}
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              <AnimatePresence mode="popLayout">
                {events.map((event, i) => {
                  const catColor = categoryColors[event.category] || "46 56% 52%";
                  const catLabel = categoryLabels[event.category]?.[isAr ? "ar" : "en"] || event.category;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: i * 0.05 }}
                      className="group rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors cursor-pointer overflow-hidden"
                      onClick={() => onEventClick(event.id)}
                    >
                      {/* Thumbnail */}
                      {event.image_url && (
                        <div className="relative h-28 w-full overflow-hidden">
                          <img
                            src={event.image_url}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                        </div>
                      )}

                      <div className="p-3 space-y-2">
                        {/* Meta row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-body border-0 px-2 py-0.5"
                            style={{
                              backgroundColor: `hsl(${catColor} / 0.15)`,
                              color: `hsl(${catColor})`,
                            }}
                          >
                            {catLabel}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-body">
                            {event.year_ce} {isAr ? "م" : "CE"}
                            {event.year_hijri && ` · ${event.year_hijri} ${isAr ? "هـ" : "AH"}`}
                          </span>
                          {event.is_major && (
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-serif-display text-sm font-bold text-foreground leading-snug line-clamp-2">
                          {isAr ? event.title : event.title_en}
                        </h4>

                        {/* Snippet */}
                        <p className="text-xs text-muted-foreground font-body leading-relaxed line-clamp-2">
                          {isAr ? event.description : event.description_en}
                        </p>

                        {/* Audio + Read more row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-secondary font-body group-hover:underline" onClick={() => onEventClick(event.id)}>
                            <ExternalLink className="h-3 w-3" />
                            {isAr ? "اقرأ المزيد" : "Read More"}
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          {event.audio_url && onPlayAudio && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => { e.stopPropagation(); onPlayAudio(event.audio_url!, event.id); }}
                              title={isAr ? "تشغيل الصوت" : "Play narration"}
                            >
                              {currentAudioEventId === event.id && audioPlaying ? (
                                <Pause className="h-3 w-3 text-secondary" />
                              ) : (
                                <Volume2 className="h-3 w-3 text-secondary" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {events.length === 0 && (
                <div className="text-center py-12 text-sm text-muted-foreground font-body">
                  {isAr ? "لا توجد أحداث في هذه الفترة" : "No events in this period"}
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventsSidebar;
