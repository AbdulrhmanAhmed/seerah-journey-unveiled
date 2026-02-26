import { useState } from "react";
import { Filter, Star, Swords, FileText, AlertCircle, Heart, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/data/eventCategories";
import type { EventCategory } from "@/data/eventCategories";

const iconMap: Record<string, React.ElementType> = {
  Star,
  Swords,
  FileText,
  AlertCircle,
  Heart,
  Send,
};

interface MapCategoryFilterProps {
  activeCategories: Set<EventCategory>;
  onToggle: (category: EventCategory) => void;
}

const MapCategoryFilter = ({ activeCategories, onToggle }: MapCategoryFilterProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-30">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-secondary transition-colors"
        aria-label="Filter categories"
      >
        <Filter size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 right-0 w-56 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-lg p-3"
          >
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Filter by Category
            </p>
            <div className="space-y-1">
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon];
                const active = activeCategories.has(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => onToggle(cat.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left font-body text-sm transition-all duration-200 ${
                      active
                        ? "bg-secondary/10 text-foreground"
                        : "text-muted-foreground/50 hover:text-muted-foreground"
                    }`}
                  >
                    <span
                      className="w-5 h-5 flex items-center justify-center rounded"
                      style={{
                        color: active ? `hsl(${cat.colorHsl})` : undefined,
                      }}
                    >
                      {Icon && <Icon size={14} />}
                    </span>
                    <span className={active ? "font-medium" : ""}>{cat.label}</span>
                    <span
                      className={`ml-auto w-2 h-2 rounded-full transition-colors ${
                        active ? "" : "bg-muted"
                      }`}
                      style={{
                        backgroundColor: active ? `hsl(${cat.colorHsl})` : undefined,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapCategoryFilter;
