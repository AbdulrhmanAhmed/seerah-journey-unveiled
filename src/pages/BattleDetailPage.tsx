import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, ArrowRight, MapPin, Calendar, Users, Swords, BookOpen, Quote, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

type Battle = any;

const outcomeStyles: Record<string, string> = {
  victory: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  defeat: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  truce: "bg-sky-500/15 text-sky-600 border-sky-500/30",
  inconclusive: "bg-slate-500/15 text-slate-600 border-slate-500/30",
  withdrawal: "bg-purple-500/15 text-purple-600 border-purple-500/30",
};

const BattleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, isRtl } = useLanguage();
  const isAr = isRtl;
  const Back = isRtl ? ArrowRight : ArrowLeft;

  const { data: battle, isLoading, error } = useQuery({
    queryKey: ["battle", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("battles").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data as Battle | null;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (error || !battle) {
    return (
      <div className="min-h-screen pt-24 pb-16 text-center">
        <p className="text-muted-foreground mb-4">{t("battleNotFound")}</p>
        <Link to="/battles" className="text-secondary underline">
          {t("battleBackToList")}
        </Link>
      </div>
    );
  }

  const name = isAr ? battle.name : battle.name_en || battle.name;
  const location = isAr ? battle.location_name : battle.location_name_en || battle.location_name;
  const cmdMuslim = isAr ? battle.commander_muslim : battle.commander_muslim_en || battle.commander_muslim;
  const cmdEnemy = isAr ? battle.commander_enemy : battle.commander_enemy_en || battle.commander_enemy;
  const opponents = isAr ? battle.opponents : battle.opponents_en || battle.opponents;
  const cause = isAr ? battle.cause : battle.cause_en || battle.cause;
  const summary = isAr ? battle.summary : battle.summary_en || battle.summary;
  const fullStory = isAr ? battle.full_story : battle.full_story_en || battle.full_story;
  const keyEvents = Array.isArray(battle.key_events) ? battle.key_events : [];
  const quranRefs = Array.isArray(battle.quran_references) ? battle.quran_references : [];
  const hadithRefs = Array.isArray(battle.hadith_references) ? battle.hadith_references : [];

  return (
    <div className="min-h-screen pt-24 pb-16" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/battles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary mb-6"
        >
          <Back size={16} />
          {t("battleBackToList")}
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pb-6 border-b border-border"
        >
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {battle.kind === "ghazwah" ? t("battlesKindGhazwah") : t("battlesKindSariyyah")}
            </Badge>
            {battle.is_major && (
              <Badge className="text-xs bg-secondary/15 text-secondary border-secondary/30 hover:bg-secondary/20">
                ★ {t("battlesFilterMajor")}
              </Badge>
            )}
            {battle.outcome && (
              <span
                className={`text-xs px-2.5 py-1 rounded-full border ${
                  outcomeStyles[battle.outcome] || outcomeStyles.inconclusive
                }`}
              >
                {t(`outcome${battle.outcome.charAt(0).toUpperCase() + battle.outcome.slice(1)}` as any)}
              </span>
            )}
          </div>
          <h1 className="font-amiri text-3xl md:text-5xl text-foreground mb-2">{name}</h1>
          {battle.gregorian_date && (
            <p className="text-sm text-muted-foreground">{battle.gregorian_date}</p>
          )}
        </motion.div>

        {battle.image_url && (
          <div className="aspect-[21/9] rounded-xl overflow-hidden mb-8 bg-muted">
            <img src={battle.image_url} alt={name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Quick facts */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Swords size={18} className="text-secondary" /> {t("battleQuickFacts")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Fact icon={<Calendar size={14} />} label={t("battleDate")} value={
              [battle.hijri_year != null ? `${battle.hijri_year} هـ` : null, battle.hijri_month, battle.gregorian_date]
                .filter(Boolean).join(" · ")
            } />
            <Fact icon={<MapPin size={14} />} label={t("battleLocation")} value={location} />
            <Fact icon={<Users size={14} />} label={t("battleCommanderMuslim")} value={cmdMuslim} />
            <Fact icon={<Users size={14} />} label={t("battleCommanderEnemy")} value={cmdEnemy} />
            <Fact label={t("battleOpponents")} value={opponents} />
            <Fact label={t("battleMuslimForces")} value={battle.muslim_forces?.toLocaleString()} />
            <Fact label={t("battleEnemyForces")} value={battle.enemy_forces?.toLocaleString()} />
            <Fact label={t("battleMuslimCasualties")} value={battle.muslim_casualties?.toLocaleString()} />
            <Fact label={t("battleEnemyCasualties")} value={battle.enemy_casualties?.toLocaleString()} />
            <Fact label={t("battleCaptives")} value={battle.enemy_captured?.toLocaleString()} />
          </div>
        </section>

        {cause && <Section title={t("battleCause")} body={cause} />}
        {summary && <Section title={t("battleSummary")} body={summary} />}
        {fullStory && <Section title={t("battleFullStory")} body={fullStory} />}

        {keyEvents.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">{t("battleKeyEvents")}</h2>
            <ol className="space-y-4 border-s-2 border-secondary/30 ps-5">
              {keyEvents.map((ev: any, i: number) => (
                <li key={i} className="relative">
                  <span className="absolute -start-[27px] top-1 w-3 h-3 rounded-full bg-secondary" />
                  <h4 className="font-amiri text-lg text-foreground">
                    {isAr ? ev.title : ev.title_en || ev.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isAr ? ev.description : ev.description_en || ev.description}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {quranRefs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-secondary" /> {t("battleQuranRefs")}
            </h2>
            <div className="space-y-3">
              {quranRefs.map((r: any, i: number) => (
                <div key={i} className="rounded-lg border border-border p-4 bg-card">
                  <div className="text-xs text-secondary mb-1">
                    {isAr ? r.surah : r.surahEn || r.surah} · {r.ayah}
                  </div>
                  <p className="font-amiri text-lg leading-loose">{isAr ? r.textAr : r.textEn || r.textAr}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hadithRefs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Quote size={18} className="text-secondary" /> {t("battleHadithRefs")}
            </h2>
            <div className="space-y-3">
              {hadithRefs.map((r: any, i: number) => (
                <div key={i} className="rounded-lg border border-border p-4 bg-card">
                  <div className="text-xs text-secondary mb-1">
                    {isAr ? r.sourceAr : r.sourceEn || r.sourceAr}
                  </div>
                  <p className="text-sm leading-relaxed">{isAr ? r.textAr : r.textEn || r.textAr}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const Fact = ({ icon, label, value }: { icon?: React.ReactNode; label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
};

const Section = ({ title, body }: { title: string; body: string }) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    <p className="text-foreground/85 leading-loose whitespace-pre-line">{body}</p>
  </section>
);

export default BattleDetailPage;
