import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Swords, Search, MapPin, Users, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

type Battle = {
  id: string;
  slug: string;
  name: string;
  name_en: string | null;
  kind: string;
  hijri_year: number | null;
  hijri_month: string | null;
  gregorian_date: string | null;
  location_name: string | null;
  location_name_en: string | null;
  commander_muslim: string | null;
  commander_muslim_en: string | null;
  outcome: string | null;
  summary: string | null;
  summary_en: string | null;
  image_url: string | null;
  is_major: boolean;
  sequence_number: number | null;
  display_order: number | null;
};

const outcomeStyles: Record<string, string> = {
  victory: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  defeat: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  truce: "bg-sky-500/15 text-sky-600 border-sky-500/30",
  inconclusive: "bg-slate-500/15 text-slate-600 border-slate-500/30",
  withdrawal: "bg-purple-500/15 text-purple-600 border-purple-500/30",
};

type FilterKey = "all" | "major" | "ghazwah" | "sariyyah";

const BattlesPage = () => {
  const { t, isRtl } = useLanguage();
  const isAr = isRtl;
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const { data: battles = [], isLoading, error } = useQuery({
    queryKey: ["battles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("battles")
        .select("*")
        .eq("is_active", true)
        .order("hijri_year", { ascending: true })
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data || []) as Battle[];
    },
  });

  const filtered = useMemo(() => {
    return battles.filter((b) => {
      if (filter === "major" && !b.is_major) return false;
      if (filter === "ghazwah" && b.kind !== "ghazwah") return false;
      if (filter === "sariyyah" && b.kind !== "sariyyah") return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          (b.name_en || "").toLowerCase().includes(q) ||
          (b.location_name || "").toLowerCase().includes(q) ||
          (b.location_name_en || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [battles, filter, search]);

  const filters: { key: FilterKey; labelKey: any }[] = [
    { key: "all", labelKey: "battlesFilterAll" },
    { key: "major", labelKey: "battlesFilterMajor" },
    { key: "ghazwah", labelKey: "battlesFilterGhazawat" },
    { key: "sariyyah", labelKey: "battlesFilterSaraya" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
            <Swords size={16} />
            <span>{t("navBattles")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-amiri mb-3">
            {t("battlesTitle")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("battlesSubtitle")}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" size={18} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("battlesSearchPlaceholder")}
              className="ps-10"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                filter === f.key
                  ? "bg-secondary text-secondary-foreground border-secondary"
                  : "bg-card text-foreground border-border hover:border-secondary/50"
              }`}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        {/* Count */}
        {!isLoading && !error && (
          <p className="text-center text-sm text-muted-foreground mb-6">
            {filtered.length} {t("battlesCount")}
          </p>
        )}

        {/* States */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-muted-foreground">
            {String((error as Error).message)}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">{t("battlesNoResults")}</div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b, idx) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.4) }}
            >
              <Link
                to={`/battles/${b.slug}`}
                className="group block h-full rounded-xl bg-card border border-border hover:border-secondary/50 hover:shadow-md transition-all overflow-hidden"
              >
                {b.image_url && (
                  <div className="aspect-[16/9] bg-muted overflow-hidden">
                    <img
                      src={b.image_url}
                      alt={isAr ? b.name : b.name_en || b.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-[11px]">
                        {b.kind === "ghazwah" ? t("battlesKindGhazwah") : t("battlesKindSariyyah")}
                      </Badge>
                      {b.is_major && (
                        <Badge className="text-[11px] bg-secondary/15 text-secondary border-secondary/30 hover:bg-secondary/20">
                          ★
                        </Badge>
                      )}
                    </div>
                    {b.outcome && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full border ${
                          outcomeStyles[b.outcome] || outcomeStyles.inconclusive
                        }`}
                      >
                        {t(`outcome${b.outcome.charAt(0).toUpperCase() + b.outcome.slice(1)}` as any)}
                      </span>
                    )}
                  </div>

                  <h3 className="font-amiri text-xl text-foreground group-hover:text-secondary transition-colors mb-1">
                    {isAr ? b.name : b.name_en || b.name}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    {b.hijri_year != null && (
                      <span>
                        {b.hijri_year} هـ
                        {b.gregorian_date ? ` · ${b.gregorian_date.split(" ").slice(-2).join(" ")}` : ""}
                      </span>
                    )}
                  </div>

                  {(b.location_name || b.location_name_en) && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <MapPin size={12} />
                      {isAr ? b.location_name : b.location_name_en || b.location_name}
                    </p>
                  )}

                  {(b.commander_muslim || b.commander_muslim_en) && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Users size={12} />
                      {isAr ? b.commander_muslim : b.commander_muslim_en || b.commander_muslim}
                    </p>
                  )}

                  {(b.summary || b.summary_en) && (
                    <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3 mb-3">
                      {isAr ? b.summary : b.summary_en || b.summary}
                    </p>
                  )}

                  <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("battleViewDetails")} <Arrow size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattlesPage;
