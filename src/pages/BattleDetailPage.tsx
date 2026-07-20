import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  ArrowLeft, ArrowRight, MapPin, Calendar, Users, Swords, BookOpen, Quote,
  Loader2, Shield, Flag, Sparkles, ChevronRight, ChevronLeft, Skull,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import TacticalBattleMap, { TacticalMapData } from "@/components/battles/TacticalBattleMap";
import ForceComparison from "@/components/battles/ForceComparison";
import PhaseStepper from "@/components/battles/PhaseStepper";
import BattleGeoMap from "@/components/battles/BattleGeoMap";

type Battle = any;

const outcomeStyles: Record<string, { badge: string; ribbon: string }> = {
  victory:      { badge: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", ribbon: "from-emerald-600/40 via-emerald-800/20 to-transparent" },
  defeat:       { badge: "bg-amber-500/15 text-amber-700 border-amber-500/30",     ribbon: "from-amber-600/40 via-amber-800/20 to-transparent" },
  truce:        { badge: "bg-sky-500/15 text-sky-600 border-sky-500/30",           ribbon: "from-sky-600/40 via-sky-800/20 to-transparent" },
  inconclusive: { badge: "bg-slate-500/15 text-slate-600 border-slate-500/30",     ribbon: "from-slate-600/40 via-slate-800/20 to-transparent" },
  withdrawal:   { badge: "bg-purple-500/15 text-purple-600 border-purple-500/30",  ribbon: "from-purple-600/40 via-purple-800/20 to-transparent" },
};

const sections = [
  { id: "overview",   key: "battleOverview" },
  { id: "background", key: "battleBackground" },
  { id: "forces",     key: "battleForceComparison" },
  { id: "tactical",   key: "battleTacticalMap" },
  { id: "geo",        key: "battleGeoMap" },
  { id: "phases",     key: "battlePhases" },
  { id: "figures",    key: "battleKeyFigures" },
  { id: "aftermath",  key: "battleAftermath" },
  { id: "lessons",    key: "battleLessons" },
  { id: "scripture",  key: "battleScripture" },
] as const;

const BattleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang, isRtl } = useLanguage();
  const isAr = lang === "ar";
  const Back = isRtl ? ArrowRight : ArrowLeft;
  const [active, setActive] = useState<string>("overview");

  const { data: battle, isLoading, error } = useQuery({
    queryKey: ["battle", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("battles").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data as Battle | null;
    },
    enabled: !!slug,
  });

  const { data: neighbors } = useQuery({
    queryKey: ["battle-neighbors", battle?.hijri_year, battle?.id],
    queryFn: async () => {
      if (!battle) return { prev: null, next: null };
      const { data } = await supabase
        .from("battles")
        .select("id, slug, name, name_en, hijri_year, display_order")
        .eq("is_active", true)
        .order("hijri_year", { ascending: true })
        .order("display_order", { ascending: true });
      const list = data || [];
      const idx = list.findIndex((b: any) => b.id === battle.id);
      return {
        prev: idx > 0 ? list[idx - 1] : null,
        next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
      };
    },
    enabled: !!battle,
  });

  const refs = useRef<Record<string, HTMLElement | null>>({});
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [battle]);

  const pick = (ar?: string | null, en?: string | null) => (isAr ? ar : en || ar) || "";

  const name = pick(battle?.name, battle?.name_en);
  const location = pick(battle?.location_name, battle?.location_name_en);
  const cmdMuslim = pick(battle?.commander_muslim, battle?.commander_muslim_en);
  const cmdEnemy = pick(battle?.commander_enemy, battle?.commander_enemy_en);
  const opponents = pick(battle?.opponents, battle?.opponents_en);
  const cause = pick(battle?.cause, battle?.cause_en);
  const summary = pick(battle?.summary, battle?.summary_en);
  const fullStory = pick(battle?.full_story, battle?.full_story_en);
  const background = pick(battle?.background, battle?.background_en);
  const preparations = pick(battle?.preparations, battle?.preparations_en);
  const aftermath = pick(battle?.aftermath, battle?.aftermath_en);
  const lessons = pick(battle?.lessons, battle?.lessons_en);

  const keyEvents = useMemo(() => (Array.isArray(battle?.key_events) ? battle.key_events : []), [battle]);
  const phases = useMemo(() => (Array.isArray(battle?.timeline_phases) ? battle.timeline_phases : []), [battle]);
  const figures = useMemo(() => (Array.isArray(battle?.key_figures) ? battle.key_figures : []), [battle]);
  const casualties = useMemo(() => (Array.isArray(battle?.casualties_detail) ? battle.casualties_detail : []), [battle]);
  const quranRefs = useMemo(() => (Array.isArray(battle?.quran_references) ? battle.quran_references : []), [battle]);
  const hadithRefs = useMemo(() => (Array.isArray(battle?.hadith_references) ? battle.hadith_references : []), [battle]);
  const tacticalMap = (battle?.tactical_map || null) as TacticalMapData | null;
  const movements = useMemo(() => (Array.isArray(battle?.troop_movements) ? battle.troop_movements : []), [battle]);
  const force = battle?.force_composition || null;

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
        <Link to="/battles" className="text-secondary underline">{t("battleBackToList")}</Link>
      </div>
    );
  }

  const outStyle = outcomeStyles[battle.outcome] || outcomeStyles.inconclusive;

  const forceRows = [
    { label: t("battleMuslimForces"), muslim: battle.muslim_forces, enemy: battle.enemy_forces },
    ...(force?.cavalry ? [{ label: isAr ? "الفرسان" : "Cavalry", muslim: force.cavalry.muslim, enemy: force.cavalry.enemy }] : []),
    ...(force?.armor ? [{ label: isAr ? "الدروع" : "Armor", muslim: force.armor.muslim, enemy: force.armor.enemy }] : []),
    ...(force?.camels ? [{ label: isAr ? "الإبل" : "Camels", muslim: force.camels.muslim, enemy: force.camels.enemy }] : []),
    { label: t("battleMuslimCasualties"), muslim: battle.muslim_casualties, enemy: battle.enemy_casualties },
    ...(battle.enemy_captured ? [{ label: t("battleCaptives"), muslim: null, enemy: battle.enemy_captured }] : []),
  ];

  const availableSections = sections.filter((s) => {
    switch (s.id) {
      case "overview": return true;
      case "background": return !!(background || preparations || cause);
      case "forces": return forceRows.some((r) => (r.muslim ?? 0) > 0 || (r.enemy ?? 0) > 0);
      case "tactical": return !!tacticalMap;
      case "geo": return battle.lat != null && battle.lng != null;
      case "phases": return phases.length > 0 || keyEvents.length > 0;
      case "figures": return figures.length > 0 || casualties.length > 0;
      case "aftermath": return !!aftermath;
      case "lessons": return !!lessons;
      case "scripture": return quranRefs.length > 0 || hadithRefs.length > 0;
    }
  });

  return (
    <div className="min-h-screen pb-16" dir={isAr ? "rtl" : "ltr"}>
      {/* Cinematic Hero */}
      <div className="relative overflow-hidden border-b border-border">
        {battle.image_url && (
          <img
            src={battle.image_url}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-b ${outStyle.ribbon}`} />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
        <div className="relative container mx-auto px-4 max-w-5xl pt-24 pb-12">
          <Link
            to="/battles"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary mb-6"
          >
            <Back size={16} />
            {t("battleBackToList")}
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs">
              {battle.kind === "ghazwah" ? t("battlesKindGhazwah") : t("battlesKindSariyyah")}
            </Badge>
            {battle.is_major && (
              <Badge className="text-xs bg-secondary/15 text-secondary border-secondary/30 hover:bg-secondary/20">
                ★ {t("battlesFilterMajor")}
              </Badge>
            )}
            {battle.outcome && (
              <span className={`text-xs px-3 py-1 rounded-full border ${outStyle.badge}`}>
                {t(`outcome${battle.outcome.charAt(0).toUpperCase() + battle.outcome.slice(1)}` as any)}
              </span>
            )}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-amiri text-4xl md:text-6xl text-foreground mb-3 leading-tight"
          >
            {name}
          </motion.h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {(battle.hijri_year != null || battle.gregorian_date) && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {[battle.hijri_year != null ? `${battle.hijri_year} هـ` : null, battle.hijri_month, battle.gregorian_date].filter(Boolean).join(" · ")}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1.5"><MapPin size={14} />{location}</span>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Sub-nav */}
      <nav className="sticky top-16 z-30 bg-background/85 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl overflow-x-auto">
          <div className="flex gap-1 py-2">
            {availableSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs transition-colors ${
                  active === s.id
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {t(s.key as any)}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-5xl pt-8">
        {/* Overview */}
        <section id="overview" className="mb-12 scroll-mt-32">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <CommanderCard title={t("battleCommanderMuslim")} side="muslim" name={cmdMuslim} sub={isAr ? "قائد المسلمين" : "Muslim Command"} />
            <CommanderCard title={t("battleCommanderEnemy")} side="enemy" name={cmdEnemy} sub={opponents} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Stat label={t("battleMuslimForces")} value={battle.muslim_forces} />
            <Stat label={t("battleEnemyForces")} value={battle.enemy_forces} />
            <Stat label={t("battleMuslimCasualties")} value={battle.muslim_casualties} accent="muslim" />
            <Stat label={t("battleEnemyCasualties")} value={battle.enemy_casualties} accent="enemy" />
            <Stat label={t("battleCaptives")} value={battle.enemy_captured} />
          </div>
          {summary && (
            <p className="mt-6 text-foreground/85 leading-loose text-lg font-amiri">{summary}</p>
          )}
        </section>

        {/* Background */}
        {(background || preparations || cause) && (
          <Section id="background" title={t("battleBackground")}>
            {cause && <Prose label={t("battleCause")} body={cause} />}
            {background && <Prose body={background} />}
            {preparations && <Prose label={t("battlePreparations")} body={preparations} />}
          </Section>
        )}

        {/* Forces */}
        {forceRows.some((r) => (r.muslim ?? 0) > 0 || (r.enemy ?? 0) > 0) && (
          <Section id="forces" title={t("battleForceComparison")} icon={<Shield size={20} />}>
            <div className="rounded-xl border border-border bg-card p-6">
              <ForceComparison rows={forceRows} />
            </div>
          </Section>
        )}

        {/* Tactical Map */}
        {tacticalMap && (
          <Section id="tactical" title={t("battleTacticalMap")} icon={<Swords size={20} />}>
            <TacticalBattleMap data={tacticalMap} />
          </Section>
        )}

        {/* Geo Map */}
        {battle.lat != null && battle.lng != null && (
          <Section id="geo" title={t("battleGeoMap")} icon={<MapPin size={20} />}>
            <BattleGeoMap lat={battle.lat} lng={battle.lng} name={name} movements={movements} />
          </Section>
        )}

        {/* Phases / Key Events */}
        {(phases.length > 0 || keyEvents.length > 0) && (
          <Section id="phases" title={t("battlePhases")} icon={<Flag size={20} />}>
            {phases.length > 0 ? (
              <PhaseStepper phases={phases} />
            ) : (
              <ol className={`space-y-4 ${isRtl ? "border-r-2 pr-5" : "border-l-2 pl-5"} border-secondary/30`}>
                {keyEvents.map((ev: any, i: number) => (
                  <li key={i} className="relative">
                    <span className={`absolute ${isRtl ? "-right-[27px]" : "-left-[27px]"} top-1 w-3 h-3 rounded-full bg-secondary`} />
                    <h4 className="font-amiri text-lg text-foreground">{pick(ev.title, ev.title_en)}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{pick(ev.description, ev.description_en)}</p>
                  </li>
                ))}
              </ol>
            )}
            {fullStory && (
              <details className="mt-6 rounded-xl border border-border bg-card p-5">
                <summary className="cursor-pointer text-sm font-semibold text-secondary">
                  {t("battleFullStory")}
                </summary>
                <p className="mt-3 text-foreground/85 leading-loose whitespace-pre-line">{fullStory}</p>
              </details>
            )}
          </Section>
        )}

        {/* Key figures + casualties */}
        {(figures.length > 0 || casualties.length > 0) && (
          <Section id="figures" title={t("battleKeyFigures")} icon={<Users size={20} />}>
            {figures.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {figures.map((f: any, i: number) => (
                  <FigureCard key={i} data={f} isAr={isAr} />
                ))}
              </div>
            )}
            {casualties.length > 0 && (
              <div>
                <h3 className="text-sm uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Skull size={14} /> {t("battleMartyrs")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {casualties.map((c: any, i: number) => (
                    <div
                      key={i}
                      className={`rounded-lg border p-3 ${
                        c.side === "muslim"
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-amber-500/30 bg-amber-500/5"
                      }`}
                    >
                      <div className="font-amiri text-base text-foreground">{pick(c.name, c.name_en)}</div>
                      {(c.note || c.note_en) && (
                        <div className="text-xs text-muted-foreground">{pick(c.note, c.note_en)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Aftermath */}
        {aftermath && (
          <Section id="aftermath" title={t("battleAftermath")} icon={<Sparkles size={20} />}>
            <Prose body={aftermath} />
          </Section>
        )}

        {/* Lessons */}
        {lessons && (
          <Section id="lessons" title={t("battleLessons")} icon={<BookOpen size={20} />}>
            <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
              <Prose body={lessons} />
            </div>
          </Section>
        )}

        {/* Scripture */}
        {(quranRefs.length > 0 || hadithRefs.length > 0) && (
          <Section id="scripture" title={t("battleScripture")} icon={<Quote size={20} />}>
            {quranRefs.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="text-sm uppercase tracking-wide text-muted-foreground">{t("battleQuranRefs")}</h3>
                {quranRefs.map((r: any, i: number) => (
                  <div key={i} className="rounded-lg border border-border p-4 bg-card">
                    <div className="text-xs text-secondary mb-1">
                      {pick(r.surah, r.surahEn) || r.surah_name} · {r.ayah || r.verse_number}
                    </div>
                    <p className="font-amiri text-lg leading-loose">
                      {pick(r.textAr, r.textEn) || r.content || r.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {hadithRefs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-wide text-muted-foreground">{t("battleHadithRefs")}</h3>
                {hadithRefs.map((r: any, i: number) => (
                  <div key={i} className="rounded-lg border border-border p-4 bg-card">
                    <div className="text-xs text-secondary mb-1">{pick(r.sourceAr, r.sourceEn) || r.source}</div>
                    <p className="text-sm leading-relaxed">{pick(r.textAr, r.textEn) || r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* Prev / Next */}
        <div className="mt-16 pt-8 border-t border-border grid grid-cols-2 gap-3">
          {neighbors?.prev ? (
            <Link
              to={`/battles/${neighbors.prev.slug}`}
              className="group rounded-xl border border-border p-4 hover:border-secondary transition-colors"
            >
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                {t("battlePrev")}
              </div>
              <div className="font-amiri text-lg text-foreground group-hover:text-secondary">
                {pick(neighbors.prev.name, neighbors.prev.name_en)}
              </div>
            </Link>
          ) : <div />}
          {neighbors?.next ? (
            <Link
              to={`/battles/${neighbors.next.slug}`}
              className="group rounded-xl border border-border p-4 hover:border-secondary transition-colors text-end"
            >
              <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                {t("battleNext")}
                {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </div>
              <div className="font-amiri text-lg text-foreground group-hover:text-secondary">
                {pick(neighbors.next.name, neighbors.next.name_en)}
              </div>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
};

const Section = ({ id, title, icon, children }: { id: string; title: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <section id={id} className="mb-12 scroll-mt-32">
    <h2 className="text-2xl font-amiri font-bold mb-5 flex items-center gap-2 text-foreground">
      {icon && <span className="text-secondary">{icon}</span>}
      {title}
    </h2>
    {children}
  </section>
);

const Prose = ({ label, body }: { label?: string; body: string }) => (
  <div className="mb-4">
    {label && <div className="text-xs uppercase tracking-wide text-secondary mb-1.5">{label}</div>}
    <p className="text-foreground/85 leading-loose whitespace-pre-line">{body}</p>
  </div>
);

const Stat = ({ label, value, accent }: { label: string; value?: number | null; accent?: "muslim" | "enemy" }) => {
  if (value == null) return null;
  const color = accent === "muslim" ? "text-emerald-600" : accent === "enemy" ? "text-amber-700" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

const CommanderCard = ({ title, side, name, sub }: { title: string; side: "muslim" | "enemy"; name: string; sub?: string }) => {
  if (!name) return null;
  const gradient = side === "muslim"
    ? "from-emerald-900/20 to-emerald-600/5 border-emerald-500/40"
    : "from-red-900/20 to-red-600/5 border-red-500/40";
  return (
    <div className={`rounded-xl border p-5 bg-gradient-to-br ${gradient}`}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
        <Users size={12} /> {title}
      </div>
      <div className="font-amiri text-2xl text-foreground">{name}</div>
      {sub && <div className="text-sm text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
};

const FigureCard = ({ data, isAr }: { data: any; isAr: boolean }) => {
  const name = isAr ? data.name : data.name_en || data.name;
  const role = isAr ? data.role : data.role_en || data.role;
  const note = isAr ? data.note : data.note_en || data.note;
  const border =
    data.side === "muslim" ? "border-emerald-500/40 bg-emerald-500/5" :
    data.side === "enemy"  ? "border-red-500/40 bg-red-500/5" :
                             "border-border bg-card";
  return (
    <div className={`rounded-lg border p-3 ${border}`}>
      <div className="font-amiri text-base text-foreground">{name}</div>
      {role && <div className="text-xs text-secondary">{role}</div>}
      {note && <div className="text-xs text-muted-foreground mt-1">{note}</div>}
    </div>
  );
};

export default BattleDetailPage;
