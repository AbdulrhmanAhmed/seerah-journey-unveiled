import { Route, Play, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { mapPaths, type MapPath } from "@/data/mapPaths";
import { useState } from "react";

interface MapPathSelectorProps {
  activePath: MapPath | null;
  onSelectPath: (path: MapPath | null) => void;
  onPlayPath: (path: MapPath) => void;
  isPlaying: boolean;
}

const MapPathSelector = ({ activePath, onSelectPath, onPlayPath, isPlaying }: MapPathSelectorProps) => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute top-4 ltr:right-4 rtl:left-4 z-30 w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-t-xl bg-card/95 backdrop-blur-md border border-border font-body text-sm font-medium text-foreground shadow-md"
      >
        <div className="flex items-center gap-2">
          <Route size={16} className="text-secondary" />
          {lang === "ar" ? "المسارات" : "Journeys"}
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-b-xl bg-card/95 backdrop-blur-md border border-t-0 border-border shadow-md"
          >
            <div className="p-2 space-y-1">
              {mapPaths.map((path) => {
                const isActive = activePath?.id === path.id;
                const name = lang === "ar" ? path.name : path.nameEn;
                const desc = lang === "ar" ? path.description : path.descriptionEn;

                return (
                  <div key={path.id}>
                    <button
                      onClick={() => onSelectPath(isActive ? null : path)}
                      className={`w-full text-start px-3 py-2.5 rounded-lg font-body text-xs transition-all duration-200 ${
                        isActive
                          ? "bg-secondary/15 border border-secondary/30"
                          : "hover:bg-muted/50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: `hsl(${path.lineColor})` }}
                        />
                        <span className="font-medium text-foreground">{name}</span>
                        <span className="text-muted-foreground ms-auto">
                          {path.steps.length} {lang === "ar" ? "خطوات" : "steps"}
                        </span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-2">
                            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                              {desc}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPlayPath(path);
                              }}
                              disabled={isPlaying}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-body text-[11px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                              <Play size={12} />
                              {lang === "ar" ? "تشغيل المسار" : "Play Path"}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapPathSelector;
