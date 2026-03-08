import { useState, useMemo, forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Heart, Star, Shield, Users, BookOpen, Eye, Smile, Crown,
  Hand, Sparkles, Sun, Moon, Feather, Gem, Award, MapPin,
  type LucideIcon, type LucideProps,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  heart: Heart, star: Star, shield: Shield, users: Users,
  "book-open": BookOpen, eye: Eye, smile: Smile, crown: Crown,
  hand: Hand, sparkles: Sparkles, sun: Sun, moon: Moon,
  feather: Feather, gem: Gem, award: Award, "map-pin": MapPin,
  "hand-heart": Hand,
};

type DynIconProps = Omit<LucideProps, "ref"> & { name: string };
const DynIcon = forwardRef<SVGSVGElement, DynIconProps>(({ name, ...props }, ref) => {
  const Icon = iconMap[name] || Heart;
  return <Icon ref={ref} {...props} />;
});
DynIcon.displayName = "DynIcon";

type Trait = {
  id: string;
  title: string;
  title_en: string;
  category: string;
  description: string | null;
  description_en: string | null;
  hadith_source: string | null;
  hadith_source_en: string | null;
  story_example: string | null;
  story_example_en: string | null;
  reflection: string | null;
  reflection_en: string | null;
  icon_name: string | null;
  image_url: string | null;
  map_location_id: string | null;
  is_active: boolean;
};

const categories = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "Moral", ar: "الصفات الخُلقية", en: "Moral" },
  { key: "Physical", ar: "الصفات الخَلقية", en: "Physical" },
  { key: "Social", ar: "التعاملات الاجتماعية", en: "Social" },
];

const CharacterPage = () => {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTrait, setSelectedTrait] = useState<Trait | null>(null);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchTraits = async () => {
      try {
        setFetchError(false);
        const { data, error } = await supabase
          .from("shamail_traits")
          .select("*")
          .eq("is_active", true)
          .order("created_at");
        if (error) {
          console.error("[CharacterPage] Fetch error:", error);
          setFetchError(true);
        } else {
          console.log("[CharacterPage] Loaded", data?.length, "traits");
          setTraits((data || []) as Trait[]);
        }
      } catch (err) {
        console.error("[CharacterPage] Exception:", err);
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTraits();
  }, []);

  const filtered = useMemo(
    () => (activeCategory === "all" ? traits : traits.filter((t) => t.category === activeCategory)),
    [traits, activeCategory]
  );

  // Trait of the Day — changes every 24h based on day-of-year
  const traitOfDay = useMemo(() => {
    if (!traits.length) return null;
    const dayOfYear = Math.floor(Date.now() / 86400000);
    return traits[dayOfYear % traits.length];
  }, [traits]);

  const tr = (ar: string | null, en: string | null) => (isAr ? ar : en) || "";

  return (
    <div className="pt-24 pb-16 min-h-screen islamic-pattern">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="font-serif-display text-4xl md:text-5xl text-secondary mb-3">
            {isAr ? "الشمائل المحمدية" : "Prophetic Traits"}
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            {isAr ? "استكشف صفات سيد الخلق ﷺ" : "Discover the noble qualities of the Prophet ﷺ"}
          </p>
        </motion.div>

        {/* Trait of the Day */}
        {traitOfDay && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-10 cursor-pointer"
            onClick={() => setSelectedTrait(traitOfDay)}
          >
            <div className="relative overflow-hidden rounded-2xl border border-secondary/30 bg-secondary/5 p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-secondary/10 transition-shadow">
              <div className="absolute top-3 end-4">
                <Badge variant="secondary" className="text-xs font-body">
                  {isAr ? "صفة اليوم" : "Trait of the Day"}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <DynIcon name={traitOfDay.icon_name || "heart"} size={28} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-serif-display text-2xl text-foreground">
                    {tr(traitOfDay.title, traitOfDay.title_en)}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm mt-1 line-clamp-2">
                    {tr(traitOfDay.description, traitOfDay.description_en)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Filters */}
        <div className="flex justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-body transition-all ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:border-secondary/50"
              }`}
            >
              {isAr ? cat.ar : cat.en}
            </button>
          ))}
        </div>

        {/* Error state */}
        {fetchError && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body mb-4">
              {isAr ? "تعذر تحميل البيانات. حاول مرة أخرى." : "Unable to load content. Please try again."}
            </p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-body">
              {isAr ? "إعادة المحاولة" : "Retry"}
            </button>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((trait, i) => (
                <motion.div
                  key={trait.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  onClick={() => setSelectedTrait(trait)}
                  className="group cursor-pointer rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-md p-6 hover:border-secondary/50 hover:shadow-[0_0_24px_hsl(var(--secondary)/0.15)] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/10 transition-colors">
                    <DynIcon
                      name={trait.icon_name || "heart"}
                      size={24}
                      className="text-primary group-hover:text-secondary transition-colors"
                    />
                  </div>
                  <h3 className="font-serif-display text-xl text-foreground mb-2">
                    {tr(trait.title, trait.title_en)}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm line-clamp-3">
                    {tr(trait.description, trait.description_en)}
                  </p>
                  <Badge variant="outline" className="mt-4 text-xs font-body">
                    {isAr
                      ? categories.find((c) => c.key === trait.category)?.ar
                      : trait.category}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Detail Dialog */}
        <Dialog open={!!selectedTrait} onOpenChange={() => setSelectedTrait(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
            {selectedTrait && (
              <div className="p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <DynIcon name={selectedTrait.icon_name || "heart"} size={32} className="text-secondary" />
                  </div>
                  <div>
                    <h2 className="font-serif-display text-3xl text-foreground">
                      {tr(selectedTrait.title, selectedTrait.title_en)}
                    </h2>
                    <Badge variant="outline" className="mt-1 text-xs font-body">
                      {isAr
                        ? categories.find((c) => c.key === selectedTrait.category)?.ar
                        : selectedTrait.category}
                    </Badge>
                  </div>
                </div>

                {/* Story */}
                {(selectedTrait.story_example || selectedTrait.story_example_en) && (
                  <div className="rounded-xl bg-primary/5 border border-primary/10 p-5">
                    <h4 className="font-serif-display text-lg text-foreground mb-2">
                      {isAr ? "من هدي النبي ﷺ" : "From the Prophet's Guidance ﷺ"}
                    </h4>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">
                      {tr(selectedTrait.story_example, selectedTrait.story_example_en)}
                    </p>
                  </div>
                )}

                {/* Hadith */}
                {(selectedTrait.hadith_source || selectedTrait.hadith_source_en) && (
                  <div className="rounded-xl bg-secondary/5 border border-secondary/10 p-5">
                    <h4 className="font-serif-display text-lg text-foreground mb-2">
                      {isAr ? "قالوا عنه" : "What They Said"}
                    </h4>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed italic">
                      {tr(selectedTrait.hadith_source, selectedTrait.hadith_source_en)}
                    </p>
                  </div>
                )}

                {/* Reflection */}
                {(selectedTrait.reflection || selectedTrait.reflection_en) && (
                  <div className="rounded-xl bg-accent/5 border border-accent/10 p-5">
                    <h4 className="font-serif-display text-lg text-foreground mb-2">
                      {isAr ? "تأمل" : "Reflection"}
                    </h4>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">
                      {tr(selectedTrait.reflection, selectedTrait.reflection_en)}
                    </p>
                  </div>
                )}

                {/* Map Link */}
                {selectedTrait.map_location_id && (
                  <Link
                    to={`/map?location=${selectedTrait.map_location_id}`}
                    className="flex items-center gap-2 text-secondary hover:text-secondary/80 font-body text-sm transition-colors"
                  >
                    <MapPin size={16} />
                    {isAr ? "عرض الموقع على الخريطة" : "View on Map"}
                  </Link>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CharacterPage;
