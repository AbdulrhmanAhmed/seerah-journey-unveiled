import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { battlesData, type Battle } from "@/data/battlesData";
import {
  Swords,
  Search,
  Trophy,
  Calendar,
  Star,
  MapPin,
  Users,
  Shield,
  X,
  ChevronDown,
  Scroll,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const BattlesPage = () => {
  const { t, lang, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [resultFilter, setResultFilter] = useState<Battle["result"] | "all">(
    "all",
  );
  const [significanceFilter, setSignificanceFilter] = useState<
    Battle["significance"] | "all"
  >("all");
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");

  // Filtered battles
  const filteredBattles = useMemo(() => {
    return battlesData.filter((battle) => {
      const nameMatch =
        lang === "ar"
          ? battle.nameAr.toLowerCase().includes(searchQuery.toLowerCase())
          : battle.nameEn.toLowerCase().includes(searchQuery.toLowerCase());

      const resultMatch =
        resultFilter === "all" || battle.result === resultFilter;
      const significanceMatch =
        significanceFilter === "all" ||
        battle.significance === significanceFilter;

      return nameMatch && resultMatch && significanceMatch;
    });
  }, [searchQuery, resultFilter, significanceFilter, lang]);

  // Stats
  const stats = useMemo(() => {
    const victories = battlesData.filter((b) => b.result === "victory").length;
    const majorBattles = battlesData.filter((b) => b.significance === 1).length;
    const yearSpan = `${battlesData[0].hijriYear}–${battlesData[battlesData.length - 1].hijriYear} ${t("battlesAH")}`;

    return {
      total: battlesData.length,
      victories,
      majorBattles,
      yearSpan,
    };
  }, [t]);

  const getResultColor = (result: Battle["result"]) => {
    switch (result) {
      case "victory":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "defeat":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "draw":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "no-combat":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
      default:
        return "";
    }
  };

  const getResultLabel = (result: Battle["result"]) => {
    const labels = {
      victory: { ar: "نصر", en: "Victory" },
      defeat: { ar: "هزيمة", en: "Defeat" },
      draw: { ar: "تعادل", en: "Draw" },
      "no-combat": { ar: "بدون قتال", en: "No Combat" },
    };
    return labels[result][lang];
  };

  const getCategoryLabel = (category: Battle["category"]) => {
    return category === "ghazwah"
      ? lang === "ar"
        ? "غزوة"
        : "Ghazwah"
      : lang === "ar"
        ? "سرية"
        : "Sariyyah";
  };

  return (
    <div className="min-h-screen bg-background islamic-pattern">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20 md:py-32"
        style={{
          background:
            "linear-gradient(165deg, #064E3B 0%, #0A3D2E 40%, #1F2937 100%)",
        }}
      >
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="battles-geo"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="40" cy="40" r="1.5" fill="#D4AF37" />
                <path
                  d="M40 10 L70 40 L40 70 L10 40 Z"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="0.5"
                />
                <path
                  d="M25 25 L55 25 L55 55 L25 55 Z"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="0.3"
                  opacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#battles-geo)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Swords className="w-12 h-12 text-[#D4AF37]" />
              <h1 className="font-serif-display text-4xl md:text-6xl lg:text-7xl font-bold text-white">
                {t("battlesTitle")}
              </h1>
            </div>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
              {t("battlesSubtitle")}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="container mx-auto px-4 -mt-12 relative z-10 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="p-6 text-center border-2 border-border/50 bg-card/95 backdrop-blur">
            <Trophy className="w-8 h-8 text-secondary mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("battlesStatTotal")}
            </div>
          </Card>
          <Card className="p-6 text-center border-2 border-border/50 bg-card/95 backdrop-blur">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground mb-1">
              {stats.victories}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("battlesStatVictories")}
            </div>
          </Card>
          <Card className="p-6 text-center border-2 border-border/50 bg-card/95 backdrop-blur">
            <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
            <div className="text-xl md:text-2xl font-bold text-foreground mb-1">
              {stats.yearSpan}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("battlesStatYearSpan")}
            </div>
          </Card>
          <Card className="p-6 text-center border-2 border-border/50 bg-card/95 backdrop-blur">
            <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground mb-1">
              {stats.majorBattles}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("battlesStatMajor")}
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 mb-12">
        <Card className="p-6 border-2 border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("battlesSearchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn("pl-10", isRtl && "pr-10 pl-3")}
              />
            </div>

            {/* Result Filter */}
            <Select
              value={resultFilter}
              onValueChange={(v) =>
                setResultFilter(v as Battle["result"] | "all")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("battlesFilterResult")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("battlesFilterAll")}</SelectItem>
                <SelectItem value="victory">
                  {getResultLabel("victory")}
                </SelectItem>
                <SelectItem value="defeat">
                  {getResultLabel("defeat")}
                </SelectItem>
                <SelectItem value="draw">{getResultLabel("draw")}</SelectItem>
                <SelectItem value="no-combat">
                  {getResultLabel("no-combat")}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Significance Filter */}
            <Select
              value={significanceFilter.toString()}
              onValueChange={(v) =>
                setSignificanceFilter(
                  v === "all" ? "all" : (parseInt(v) as Battle["significance"]),
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("battlesFilterSignificance")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("battlesFilterAll")}</SelectItem>
                <SelectItem value="1">{t("battlesFilterMajor")}</SelectItem>
                <SelectItem value="2">
                  {t("battlesFilterSignificant")}
                </SelectItem>
                <SelectItem value="3">{t("battlesFilterMinor")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {t("battlesShowingResults")}:{" "}
              <span className="font-semibold text-foreground">
                {filteredBattles.length}
              </span>{" "}
              / {battlesData.length}
            </p>
          </div>
        </Card>
      </section>

      {/* Battles Grid */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBattles.map((battle, index) => (
            <motion.div
              key={battle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card
                className="group cursor-pointer h-full border-2 border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl overflow-hidden"
                onClick={() => setSelectedBattle(battle)}
              >
                {/* Card Header */}
                <div
                  className="p-6 pb-4 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(6, 78, 59, 0.1) 0%, rgba(31, 41, 55, 0.05) 100%)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-serif-display text-xl md:text-2xl font-bold text-foreground flex-1 leading-tight">
                      {lang === "ar" ? battle.nameAr : battle.nameEn}
                    </h3>
                    {battle.significance === 1 && (
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={cn("border", getResultColor(battle.result))}
                    >
                      {getResultLabel(battle.result)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-secondary/30 text-secondary"
                    >
                      {getCategoryLabel(battle.category)}
                    </Badge>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 pt-4">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {battle.hijriYear} {t("battlesAH")} /{" "}
                        {battle.gregorianYear} {t("battlesCE")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {lang === "ar" ? battle.locationAr : battle.locationEn}
                      </span>
                    </div>
                    {battle.muslimForces && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>
                          {t("battlesMuslimForces")}:{" "}
                          {battle.muslimForces.toLocaleString()}
                          {battle.enemyForces &&
                            ` vs ${battle.enemyForces.toLocaleString()}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {lang === "ar"
                      ? battle.descriptionAr
                      : battle.descriptionEn}
                  </p>

                  <button className="text-secondary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t("battlesLearnMore")}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isRtl ? "rotate-90" : "-rotate-90",
                      )}
                    />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredBattles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Scroll className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {t("battlesNoResults")}
            </p>
          </motion.div>
        )}
      </section>

      {/* Battle Detail Modal */}
      <AnimatePresence>
        {selectedBattle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBattle(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-card border-2 border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 p-6 border-b border-border backdrop-blur-sm bg-card/95">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-serif-display text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
                      {lang === "ar"
                        ? selectedBattle.nameAr
                        : selectedBattle.nameEn}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        className={cn(
                          "border",
                          getResultColor(selectedBattle.result),
                        )}
                      >
                        {getResultLabel(selectedBattle.result)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-secondary/30 text-secondary"
                      >
                        {getCategoryLabel(selectedBattle.category)}
                      </Badge>
                      {selectedBattle.significance === 1 && (
                        <Badge
                          variant="outline"
                          className="border-amber-500/30 text-amber-600"
                        >
                          {t("battlesFilterMajor")}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBattle(null)}
                    className="p-2 rounded-full hover:bg-secondary/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Key Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                    <Calendar className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {t("battlesDate")}
                      </div>
                      <div className="font-semibold">
                        {selectedBattle.hijriYear} {t("battlesAH")} /{" "}
                        {selectedBattle.gregorianYear} {t("battlesCE")}
                      </div>
                      {selectedBattle.month && (
                        <div className="text-sm text-muted-foreground">
                          {selectedBattle.month}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                    <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {t("battlesLocation")}
                      </div>
                      <div className="font-semibold">
                        {lang === "ar"
                          ? selectedBattle.locationAr
                          : selectedBattle.locationEn}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Forces Comparison */}
                {selectedBattle.muslimForces && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-secondary" />
                      {t("battlesForcesComparison")}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {t("battlesMuslimForces")}
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            {selectedBattle.muslimForces.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-3 bg-secondary/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{
                              width: selectedBattle.enemyForces
                                ? `${(selectedBattle.muslimForces / (selectedBattle.muslimForces + selectedBattle.enemyForces)) * 100}%`
                                : "100%",
                            }}
                          />
                        </div>
                      </div>
                      {selectedBattle.enemyForces && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              {t("battlesEnemyForces")}
                            </span>
                            <span className="text-sm font-bold text-red-600">
                              {selectedBattle.enemyForces.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-3 bg-secondary/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full"
                              style={{
                                width: `${(selectedBattle.enemyForces / (selectedBattle.muslimForces + selectedBattle.enemyForces)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Outcome */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-secondary" />
                    {t("battlesOutcome")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {lang === "ar"
                      ? selectedBattle.outcomeAr
                      : selectedBattle.outcomeEn}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Scroll className="w-5 h-5 text-secondary" />
                    {t("battlesDescription")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {lang === "ar"
                      ? selectedBattle.descriptionAr
                      : selectedBattle.descriptionEn}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattlesPage;
