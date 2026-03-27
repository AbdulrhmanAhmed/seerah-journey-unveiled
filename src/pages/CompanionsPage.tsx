import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Search, Users, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type Companion = {
  id: string;
  name: string;
  name_en: string;
  nickname: string;
  nickname_en: string;
  bio: string;
  bio_en: string;
  category: string;
  birth_year: string;
  death_year: string;
  image_url: string | null;
  notable_roles: string[];
  related_event_ids: string[];
  family_relation: string;
};

const categories = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "family", ar: "أهل البيت", en: "Ahl al-Bayt" },
  { key: "muhajir", ar: "المهاجرون", en: "Muhajiroon" },
  { key: "ansar", ar: "الأنصار", en: "Ansar" },
  { key: "other", ar: "آخرون", en: "Other" },
];

const CompanionsPage = () => {
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);

  const { data: companions = [], isLoading } = useQuery({
    queryKey: ["companions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companions")
        .select("*")
        .eq("is_active", true)
        .order("name_en");
      if (error) throw error;
      return (data || []) as Companion[];
    },
  });

  const filtered = companions.filter((c) => {
    const matchesCategory = activeCategory === "all" || c.category === activeCategory;
    const matchesSearch =
      !search ||
      c.name.includes(search) ||
      c.name_en.toLowerCase().includes(search.toLowerCase()) ||
      c.nickname.includes(search) ||
      c.nickname_en.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
            <Users size={16} />
            <span>{isAr ? "الصحابة" : "Companions"}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-amiri mb-3">
            {isAr ? "دليل الصحابة" : "Companions Directory"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isAr
              ? "تعرّف على صحابة رسول الله ﷺ الذين حملوا رسالته ونشروا نوره في العالمين"
              : "Discover the companions of the Prophet ﷺ who carried his message and spread his light across the world"}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" size={18} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAr ? "ابحث عن صحابي..." : "Search companions..."}
              className="ps-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary/20"
              }`}
            >
              {isAr ? cat.ar : cat.en}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {isAr ? "لا توجد نتائج" : "No companions found"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((companion, i) => (
              <motion.div
                key={companion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedCompanion(companion)}
                className="group cursor-pointer rounded-xl border border-border bg-card p-5 hover:border-secondary/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-lg shrink-0">
                    {(isAr ? companion.name : companion.name_en).charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground truncate">
                      {isAr ? companion.name : companion.name_en}
                    </h3>
                    {(isAr ? companion.nickname : companion.nickname_en) && (
                      <p className="text-xs text-muted-foreground truncate">
                        {isAr ? companion.nickname : companion.nickname_en}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {isAr ? companion.bio : companion.bio_en}
                </p>
                <Badge variant="outline" className="text-xs">
                  {categories.find((c) => c.key === companion.category)?.[isAr ? "ar" : "en"] || companion.category}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedCompanion} onOpenChange={() => setSelectedCompanion(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto" dir={isAr ? "rtl" : "ltr"}>
          {selectedCompanion && (
            <>
              <DialogHeader>
                <DialogTitle className="font-amiri text-xl">
                  {isAr ? selectedCompanion.name : selectedCompanion.name_en}
                </DialogTitle>
                {(isAr ? selectedCompanion.nickname : selectedCompanion.nickname_en) && (
                  <p className="text-sm text-muted-foreground">
                    {isAr ? selectedCompanion.nickname : selectedCompanion.nickname_en}
                  </p>
                )}
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {selectedCompanion.family_relation && (
                  <div className="px-3 py-2 rounded-lg bg-secondary/10 text-sm text-secondary">
                    {selectedCompanion.family_relation}
                  </div>
                )}

                <p className="text-sm leading-relaxed text-foreground/90">
                  {isAr ? selectedCompanion.bio : selectedCompanion.bio_en}
                </p>

                {selectedCompanion.birth_year && (
                  <div className="text-xs text-muted-foreground">
                    {isAr ? "الميلاد" : "Born"}: {selectedCompanion.birth_year}
                    {selectedCompanion.death_year && ` — ${isAr ? "الوفاة" : "Died"}: ${selectedCompanion.death_year}`}
                  </div>
                )}

                {Array.isArray(selectedCompanion.notable_roles) && selectedCompanion.notable_roles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">{isAr ? "أدوار بارزة" : "Notable Roles"}</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedCompanion.notable_roles.map((role, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{role}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanionsPage;
