import { useState } from "react";
import { Compass, Route } from "lucide-react";
import { motion } from "framer-motion";
import ArabianMapSVG from "@/components/ArabianMapSVG";
import LocationCard from "@/components/LocationCard";
import type { MapLocation } from "@/data/mapLocations";

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [showRoute, setShowRoute] = useState(false);

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation((prev) => (prev?.id === location.id ? null : location));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 islamic-pattern">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
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
            The Map
          </h1>
          <p className="text-muted-foreground font-body">
            Explore the lands that shaped the Prophetic mission. Tap on any location to discover its story.
          </p>
        </motion.div>

        {/* Controls */}
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
            {showRoute ? "Hide Hijrah Route" : "Toggle Hijrah Route"}
          </button>
        </motion.div>

        {/* Map container */}
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
            />
          </div>

          {/* Location Card overlay */}
          <LocationCard
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mt-6 font-body text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            Key Location
          </div>
          {showRoute && (
            <div className="flex items-center gap-2">
              <span className="w-6 border-t-2 border-dashed border-secondary" />
              Hijrah Route (622 CE)
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MapPage;
