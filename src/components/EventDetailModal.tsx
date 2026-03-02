import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Quote, Link2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface QuranReference {
  surah: string;
  ayah: string;
  text: string;
  text_en: string;
}

export interface HadithReference {
  source: string;
  text: string;
  text_en: string;
}

export interface EventDetailData {
  id: string;
  title: string;
  title_en: string;
  description: string | null;
  description_en: string | null;
  full_story: string | null;
  full_story_en: string | null;
  year_ce: number;
  year_hijri: string | null;
  era: string;
  category: string;
  image_url: string | null;
  location_id: string | null;
  quran_references: QuranReference[];
  hadith_references: HadithReference[];
  related_event_ids: string[];
}

export interface RelatedEvent {
  id: string;
  title: string;
  title_en: string;
  year_ce: number;
  category: string;
}

interface EventDetailModalProps {
  event: EventDetailData | null;
  relatedEvents?: RelatedEvent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRelatedEventClick?: (eventId: string) => void;
}

const categoryLabels: Record<string, { ar: string; en: string }> = {
  milestone: { ar: "حدث بارز", en: "Milestone" },
  battle: { ar: "غزوة", en: "Battle" },
  contract: { ar: "عهد / صلح", en: "Treaty" },
  challenge: { ar: "ابتلاء", en: "Challenge" },
  marriage: { ar: "زواج", en: "Marriage" },
  diplomacy: { ar: "دبلوماسية", en: "Diplomacy" },
};

const categoryColors: Record<string, string> = {
  milestone: "bg-secondary/15 text-secondary",
  battle: "bg-destructive/15 text-destructive",
  contract: "bg-blue-500/15 text-blue-600",
  challenge: "bg-orange-500/15 text-orange-600",
  marriage: "bg-pink-500/15 text-pink-600",
  diplomacy: "bg-emerald-500/15 text-emerald-600",
};

const EventDetailModal = ({
  event,
  relatedEvents = [],
  open,
  onOpenChange,
  onRelatedEventClick,
}: EventDetailModalProps) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  if (!event) return null;

  const title = isAr ? event.title : event.title_en;
  const description = isAr ? event.description : event.description_en;
  const fullStory = isAr ? event.full_story : event.full_story_en;
  const eraLabel = event.era === "makkah"
    ? (isAr ? "العهد المكي" : "Makkan Period")
    : (isAr ? "العهد المدني" : "Madinan Period");
  const catLabel = categoryLabels[event.category]?.[isAr ? "ar" : "en"] || event.category;
  const catColor = categoryColors[event.category] || "bg-muted text-muted-foreground";

  const quranRefs = event.quran_references || [];
  const hadithRefs = event.hadith_references || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-border bg-card p-0">
        {/* Hero header */}
        <div className="relative">
          {event.image_url && (
            <div className="w-full h-48 md:h-56 overflow-hidden rounded-t-lg">
              <img
                src={event.image_url}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            </div>
          )}

          <DialogHeader className={`px-6 ${event.image_url ? "pt-4 -mt-16 relative z-10" : "pt-6"} pb-2`}>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge variant="outline" className={`text-xs font-body ${catColor} border-0`}>
                {catLabel}
              </Badge>
              <Badge variant="outline" className="text-xs font-body border-border">
                {eraLabel}
              </Badge>
            </div>
            <p className="font-body text-sm text-muted-foreground">
              {event.year_ce} {isAr ? "م" : "CE"}
              {event.year_hijri && (
                <span className="ms-2 text-secondary">
                  ({event.year_hijri} {isAr ? "هـ" : "AH"})
                </span>
              )}
            </p>
            <DialogTitle className="font-serif-display text-2xl md:text-3xl text-foreground leading-snug">
              {title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {isAr ? "تفاصيل حدث" : "Event details"}: {title}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Description */}
          {description && (
            <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          {/* Full story */}
          {fullStory && (
            <div>
              <h4 className="font-serif-display text-lg text-foreground mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-secondary" />
                {isAr ? "القصة الكاملة" : "Full Story"}
              </h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {fullStory}
              </p>
            </div>
          )}

          {/* Quran References */}
          {quranRefs.length > 0 && (
            <div>
              <Separator className="mb-4" />
              <h4 className="font-serif-display text-lg text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-secondary" />
                {isAr ? "آيات قرآنية" : "Quran References"}
              </h4>
              <div className="space-y-3">
                {quranRefs.map((ref, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <p className="font-body text-xs text-secondary font-semibold mb-1">
                      {isAr ? `سورة ${ref.surah} — آية ${ref.ayah}` : `Surah ${ref.surah} — Ayah ${ref.ayah}`}
                    </p>
                    <p className="font-serif-display text-base text-foreground leading-relaxed">
                      {isAr ? ref.text : ref.text_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hadith References */}
          {hadithRefs.length > 0 && (
            <div>
              <Separator className="mb-4" />
              <h4 className="font-serif-display text-lg text-foreground mb-3 flex items-center gap-2">
                <Quote className="h-4 w-4 text-secondary" />
                {isAr ? "أحاديث نبوية" : "Hadith References"}
              </h4>
              <div className="space-y-3">
                {hadithRefs.map((ref, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <p className="font-body text-xs text-secondary font-semibold mb-1">
                      {ref.source}
                    </p>
                    <p className="font-body text-sm text-foreground leading-relaxed italic">
                      {isAr ? ref.text : ref.text_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div>
              <Separator className="mb-4" />
              <h4 className="font-serif-display text-lg text-foreground mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-secondary" />
                {isAr ? "أحداث مرتبطة" : "Related Events"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {relatedEvents.map((re) => (
                  <button
                    key={re.id}
                    onClick={() => onRelatedEventClick?.(re.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted/50 transition-colors text-sm font-body text-foreground"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          re.category === "milestone" ? "hsl(46 56% 52%)" :
                          re.category === "battle" ? "hsl(0 72% 50%)" :
                          re.category === "contract" ? "hsl(200 60% 50%)" :
                          "hsl(46 56% 52%)",
                      }}
                    />
                    {isAr ? re.title : re.title_en}
                    <span className="text-xs text-muted-foreground">
                      {re.year_ce} {isAr ? "م" : "CE"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location link */}
          {event.location_id && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
              <MapPin className="h-3.5 w-3.5 text-secondary" />
              {isAr ? "الموقع:" : "Location:"} {event.location_id}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;
