import { X, Footprints, Car, Star, Swords, FileText, AlertCircle, Heart, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { categoryMap } from "@/data/eventCategories";
import type { MapLocation } from "@/data/mapLocations";
import type { EventCategory } from "@/data/eventCategories";

const iconMap: Record<string, React.ElementType> = {
  Star, Swords, FileText, AlertCircle, Heart, Send,
};

interface LocationCardProps {
  location: MapLocation | null;
  onClose: () => void;
}

const CategoryBadge = ({ category }: { category: EventCategory }) => {
  const { lang } = useLanguage();
  const cat = categoryMap[category];
  const Icon = iconMap[cat.icon];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body font-medium"
      style={{
        backgroundColor: `hsl(${cat.colorHsl} / 0.12)`,
        color: `hsl(${cat.colorHsl})`,
      }}
    >
      {Icon && <Icon size={10} />}
      {lang === "ar" ? cat.label : cat.labelEn}
    </span>
  );
};

const LocationCard = ({ location, onClose }: LocationCardProps) => {
  const { t, lang } = useLanguage();

  if (!location) return null;

  const name = lang === "ar" ? location.name : location.nameEn;
  const description = lang === "ar" ? location.description : location.descriptionEn;
  const camelDays = lang === "ar" ? location.travel.camelDays : location.travel.camelDaysEn;
  const carHours = lang === "ar" ? location.travel.carHours : location.travel.carHoursEn;
  const from = lang === "ar" ? location.travel.from : location.travel.fromEn;

  return (
    <AnimatePresence>
      <motion.div
        key={location.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-4 right-4 left-4 md:right-auto md:left-4 md:bottom-4 md:w-96 z-20 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-lg overflow-hidden"
      >
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
                {name}
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
            {description}
          </p>

          <div className="mb-3">
            <h4 className="font-body text-xs font-semibold text-secondary mb-2">
              {t("locationEvents")}
            </h4>
            <ul className="space-y-1.5">
              {location.events.map((event, i) => (
                <li
                  key={i}
                  className="font-body text-xs text-muted-foreground flex items-start gap-2"
                >
                  <CategoryBadge category={event.category} />
                  <span className="pt-0.5">{lang === "ar" ? event.label : event.labelEn}</span>
                </li>
              ))}
            </ul>
          </div>

          {location.travel.distanceKm > 0 && (
            <div className="rounded-lg bg-muted/50 p-3 border border-border/50">
              <h4 className="font-body text-xs font-semibold text-foreground/70 mb-2">
                {t("locationDistanceFrom")} {from}
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Footprints size={14} className="text-secondary" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground">{t("locationByCamel")}</p>
                    <p className="font-body text-sm font-semibold text-foreground">
                      {camelDays}
                    </p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex items-center gap-1.5">
                  <Car size={14} className="text-primary" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground">{t("locationByCar")}</p>
                    <p className="font-body text-sm font-semibold text-foreground">
                      {carHours}
                    </p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="font-body text-xs text-muted-foreground">{t("locationDistance")}</p>
                  <p className="font-body text-sm font-semibold text-foreground">
                    {location.travel.distanceKm} {t("locationKm")}
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
