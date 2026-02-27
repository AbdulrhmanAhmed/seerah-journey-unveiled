import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TimelineEvent } from "@/data/seerahTimeline";

interface TimelineEventModalProps {
  event: TimelineEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TimelineEventModal = ({ event, open, onOpenChange }: TimelineEventModalProps) => {
  const { lang } = useLanguage();

  if (!event) return null;

  const title = lang === "ar" ? event.title : event.titleEn;
  const details = lang === "ar" ? event.details : event.detailsEn;
  const year = lang === "ar" ? event.year : event.yearEn;
  const hijriYear = lang === "ar" ? event.hijriYear : event.hijriYearEn;
  const eraLabel = event.era === "makkah"
    ? (lang === "ar" ? "العهد المكي" : "Makkan Period")
    : (lang === "ar" ? "العهد المدني" : "Madinan Period");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto border-border bg-card">
        <DialogHeader>
          <span
            className={`inline-block text-xs font-body font-semibold mb-1 px-2.5 py-0.5 rounded-full w-fit ${
              event.era === "makkah"
                ? "bg-secondary/15 text-secondary"
                : "bg-primary/15 text-primary"
            }`}
          >
            {eraLabel}
          </span>
          <p className="font-body text-sm text-muted-foreground">
            {year}
            {hijriYear && (
              <span className="me-2 text-secondary">({hijriYear})</span>
            )}
          </p>
          <DialogTitle className="font-serif-display text-2xl md:text-3xl text-foreground leading-snug">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {lang === "ar" ? "تفاصيل" : "Details of"} {title}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
            {details}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimelineEventModal;
