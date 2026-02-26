import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { TimelineEvent } from "@/data/seerahTimeline";

interface TimelineEventModalProps {
  event: TimelineEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TimelineEventModal = ({ event, open, onOpenChange }: TimelineEventModalProps) => {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto border-border bg-card">
        <DialogHeader>
          <span
            className={`inline-block text-xs font-body font-semibold uppercase tracking-widest mb-1 px-2.5 py-0.5 rounded-full w-fit ${
              event.era === "makkah"
                ? "bg-secondary/15 text-secondary"
                : "bg-primary/15 text-primary"
            }`}
          >
            {event.era === "makkah" ? "Makkah Era" : "Madinah Era"}
          </span>
          <p className="font-body text-sm text-muted-foreground">
            {event.year}
            {event.hijriYear && (
              <span className="ml-2 text-secondary">({event.hijriYear})</span>
            )}
          </p>
          <DialogTitle className="font-serif-display text-2xl md:text-3xl text-foreground leading-snug">
            {event.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Details about {event.title}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
            {event.details}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimelineEventModal;
