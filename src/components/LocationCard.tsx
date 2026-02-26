import { X, Footprints, Car } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MapLocation } from "@/data/mapLocations";

interface LocationCardProps {
  location: MapLocation | null;
  onClose: () => void;
}

const LocationCard = ({ location, onClose }: LocationCardProps) => {
  if (!location) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={location.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-96 z-20 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-lg overflow-hidden"
      >
        {/* Photo placeholder */}
        <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center islamic-pattern-dense">
          <div className="text-center">
            <p className="font-serif-display text-3xl text-foreground/80">
              {location.nameArabic}
            </p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-serif-display text-xl text-foreground">
                {location.name}
              </h3>
              <p className="font-body text-xs text-muted-foreground">{location.nameArabic}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            >
              <X size={16} />
            </button>
          </div>

          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
            {location.description}
          </p>

          {/* Key events */}
          <div className="mb-3">
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
              Key Events
            </h4>
            <ul className="space-y-1">
              {location.events.map((event, i) => (
                <li
                  key={i}
                  className="font-body text-xs text-muted-foreground flex items-start gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-secondary mt-1.5 shrink-0" />
                  {event}
                </li>
              ))}
            </ul>
          </div>

          {/* Distance tooltip */}
          {location.travel.distanceKm > 0 && (
            <div className="rounded-lg bg-muted/50 p-3 border border-border/50">
              <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-foreground/70 mb-2">
                Distance from {location.travel.from}
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Footprints size={14} className="text-secondary" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground">By camel</p>
                    <p className="font-body text-sm font-semibold text-foreground">
                      {location.travel.camelDays}
                    </p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex items-center gap-1.5">
                  <Car size={14} className="text-primary" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground">By car today</p>
                    <p className="font-body text-sm font-semibold text-foreground">
                      {location.travel.carHours}
                    </p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="font-body text-xs text-muted-foreground">Distance</p>
                  <p className="font-body text-sm font-semibold text-foreground">
                    {location.travel.distanceKm} km
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LocationCard;
