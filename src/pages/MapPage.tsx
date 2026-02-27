import { useState, useEffect, useCallback, useRef } from "react";
import { Compass, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useLanguage } from "@/i18n/LanguageContext";
import ArabianMapSVG from "@/components/ArabianMapSVG";
import LocationCard from "@/components/LocationCard";
import MapCategoryFilter from "@/components/MapCategoryFilter";
import MapPathSelector from "@/components/MapPathSelector";
import MapStepNavigator from "@/components/MapStepNavigator";
import { categories } from "@/data/eventCategories";
import { mapLocations } from "@/data/mapLocations";
import type { MapLocation } from "@/data/mapLocations";
import type { EventCategory } from "@/data/eventCategories";
import type { MapPath } from "@/data/mapPaths";
import { Button } from "@/components/ui/button";

const CINEMATIC_DELAY = 5000;

const MapPage = () => {
  const { t, lang } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<EventCategory>>(
    () => new Set(categories.map((c) => c.id))
  );
  const [activePath, setActivePath] = useState<MapPath | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);

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

  const handleSelectPath = (path: MapPath | null) => {
    stopPlaying();
    setActivePath(path);
    setCurrentStep(0);
    setSelectedLocation(null);
    if (path?.steps[0]?.locationId) {
      const loc = mapLocations.find((l) => l.id === path.steps[0].locationId);
      if (loc) setSelectedLocation(loc);
    }
  };

  const handleStepChange = useCallback(
    (step: number) => {
      if (!activePath || step < 0 || step >= activePath.steps.length) return;
      setCurrentStep(step);
      const s = activePath.steps[step];
      if (s.locationId) {
        const loc = mapLocations.find((l) => l.id === s.locationId);
        setSelectedLocation(loc ?? null);
      } else {
        setSelectedLocation(null);
      }
    },
    [activePath]
  );

  const stopPlaying = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handlePlayPath = (path: MapPath) => {
    stopPlaying();
    setActivePath(path);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlaying();
    } else {
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    stopPlaying();
    setCurrentStep(0);
    if (activePath?.steps[0]?.locationId) {
      const loc = mapLocations.find((l) => l.id === activePath.steps[0].locationId);
      setSelectedLocation(loc ?? null);
    }
  };

  // Cinematic auto-advance
  useEffect(() => {
    if (!isPlaying || !activePath) return;
    handleStepChange(currentStep);

    intervalRef.current = window.setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= activePath.steps.length) {
          stopPlaying();
          return prev;
        }
        return next;
      });
    }, CINEMATIC_DELAY);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, activePath]);

  // Update location card when step changes during playback
  useEffect(() => {
    if (activePath && currentStep >= 0) {
      const s = activePath.steps[currentStep];
      if (s?.locationId) {
        const loc = mapLocations.find((l) => l.id === s.locationId);
        setSelectedLocation(loc ?? null);
      } else {
        setSelectedLocation(null);
      }
    }
  }, [currentStep, activePath]);

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
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-5xl mx-auto rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden"
        >
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={5}
            centerOnInit
            wheel={{ step: 0.08 }}
            panning={{ velocityDisabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Zoom controls */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm border-border shadow-sm"
                    onClick={() => zoomIn()}
                  >
                    <ZoomIn size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm border-border shadow-sm"
                    onClick={() => zoomOut()}
                  >
                    <ZoomOut size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm border-border shadow-sm"
                    onClick={() => resetTransform()}
                  >
                    <RotateCcw size={16} />
                  </Button>
                </div>

                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%" }}
                >
                  <div className="aspect-[4/3] p-4 md:p-8">
                    <ArabianMapSVG
                      onLocationClick={handleLocationClick}
                      selectedId={selectedLocation?.id ?? null}
                      activeCategories={activeCategories}
                      activePath={activePath}
                      activeStep={activePath ? currentStep : -1}
                    />
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>

          <MapPathSelector
            activePath={activePath}
            onSelectPath={handleSelectPath}
            onPlayPath={handlePlayPath}
            isPlaying={isPlaying}
          />

          {!activePath && (
            <LocationCard
              location={selectedLocation}
              onClose={() => setSelectedLocation(null)}
            />
          )}

          {activePath && (
            <MapStepNavigator
              path={activePath}
              currentStep={currentStep}
              onStepChange={handleStepChange}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onStop={handleStop}
            />
          )}

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
        </motion.div>
      </div>
    </div>
  );
};

export default MapPage;
