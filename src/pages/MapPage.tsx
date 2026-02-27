import { useState } from "react";
import { Compass, Route } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import ArabianMapSVG from "@/components/ArabianMapSVG";
import LocationCard from "@/components/LocationCard";
import MapCategoryFilter from "@/components/MapCategoryFilter";
import { categories } from "@/data/eventCategories";
import type { MapLocation } from "@/data/mapLocations";
import type { EventCategory } from "@/data/eventCategories";

const MapPage = () => {
  const { t, lang } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [activeCategories, setActiveCategories] = useState<Set<EventCategory>>(
    () => new Set(categories.map((c) => c.id))
  );

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation((prev) => (prev?.id === location.id ? null : location));
  };

  const handleToggleCategory = (cat: EventCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 islamic-pattern">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <Compass size={28} className="text-secondary" />
          </div>
          <h1 className="font-serif-display text-4xl md:text-5xl text-foreground mb-4">
            {t("mapTitle")}
          </h1>
          <p className="text-muted-foreground font-body">
            {t("mapSubtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <button
            onClick={() => setShowRoute((p) => !p)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-medium border transition-all duration-300 ${
              showRoute
                ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
                : "bg-card border-border text-muted-foreground hover:border-secondary/50 hover:text-secondary"
            }`}
          >
            <Route size={16} />
            {showRoute ? t("mapHideRoute") : t("mapShowRoute")}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-4xl mx-auto rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden"
        >
          <div className="aspect-square md:aspect-[4/3] p-4 md:p-8">
            <ArabianMapSVG
              onLocationClick={handleLocationClick}
              selectedId={selectedLocation?.id ?? null}
              showRoute={showRoute}
              activeCategories={activeCategories}
            />
          </div>

          <LocationCard
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />

          <MapCategoryFilter
            activeCategories={activeCategories}
            onToggle={handleToggleCategory}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mt-6 font-body text-xs text-muted-foreground"
        >
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: `hsl(${cat.colorHsl})` }}
              />
              {lang === "ar" ? cat.label : cat.labelEn}
            </div>
          ))}
          {showRoute && (
            <div className="flex items-center gap-2">
              <span className="w-6 border-t-2 border-dashed border-secondary" />
              {t("mapRouteLegend")}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MapPage;
