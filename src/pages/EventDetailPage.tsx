import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Quote,
  Link2,
  Calendar,
  BookMarked,
  Scroll,
  Star,
  AlertCircle,
  Heart,
  Send,
  Swords,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { richEvents } from "@/data/richEventDetails";
import { timelineEvents } from "@/data/seerahTimeline";

const iconMap: Record<string, React.ElementType> = {
  Star,
  AlertCircle,
  Heart,
  Send,
  Swords,
  FileText,
  BookOpen,
};

const categoryLabels: Record<string, { ar: string; en: string }> = {
  milestone: { ar: "حدث بارز", en: "Milestone" },
  battle: { ar: "غزوة", en: "Battle" },
  contract: { ar: "عهد / صلح", en: "Treaty" },
  challenge: { ar: "ابتلاء", en: "Challenge" },
  marriage: { ar: "زواج", en: "Marriage" },
  diplomacy: { ar: "دبلوماسية", en: "Diplomacy" },
};

const categoryColors: Record<string, string> = {
  milestone: "bg-secondary/15 text-secondary",
  battle: "bg-destructive/15 text-destructive",
  contract: "bg-blue-500/15 text-blue-600",
  challenge: "bg-orange-500/15 text-orange-600",
  marriage: "bg-pink-500/15 text-pink-600",
  diplomacy: "bg-emerald-500/15 text-emerald-600",
};

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const richEvent = id ? richEvents[id] : undefined;

  // Fallback: basic data from local timeline
  const basicEvent = !richEvent
    ? timelineEvents.find((e) => e.id === id)
    : undefined;

  if (!richEvent && !basicEvent) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-4">
          <h1 className="font-serif-display text-2xl md:text-3xl text-foreground">
            {isAr ? "الحدث غير موجود" : "Event not found"}
          </h1>
          <p className="font-body text-muted-foreground">
            {isAr
              ? "لم نعثر على هذا الحدث. جرّب العودة إلى صفحة الرحلة واختيار حدث آخر."
              : "We couldn't find this event. Go back to the Journey and choose another one."}
          </p>
          <button
            onClick={() => navigate("/journey")}
            className="inline-flex items-center gap-2 font-body text-secondary hover:text-secondary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {isAr ? "العودة إلى الرحلة" : "Back to Journey"}
          </button>
        </div>
      </div>
    );
  }

  // ── Basic fallback (no rich data yet) ──
  if (!richEvent && basicEvent) {
    const title = isAr ? basicEvent.title : basicEvent.titleEn;
    const details = isAr ? basicEvent.details : basicEvent.detailsEn;
    const year = isAr ? basicEvent.year : basicEvent.yearEn;
    const eraLabel =
      basicEvent.era === "makkah"
        ? isAr ? "العهد المكي" : "Makkan Period"
        : isAr ? "العهد المدني" : "Madinan Period";

    return (
      <div className="min-h-screen">
        <div
          className="w-full h-48 md:h-64"
          style={{
            background:
              basicEvent.era === "makkah"
                ? "linear-gradient(135deg, hsl(48 44% 92%), hsl(46 56% 82%))"
                : "linear-gradient(135deg, hsl(160 40% 90%), hsl(160 50% 80%))",
          }}
        />
        <div className="container mx-auto px-4 md:px-6 max-w-3xl -mt-16 relative z-10 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => navigate("/journey")}
              className="inline-flex items-center gap-1.5 text-sm font-body text-foreground/70 hover:text-foreground mb-4 transition-colors"
            >
              <BackArrow size={16} />
              {isAr ? "العودة" : "Back"}
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs font-body border-border">{eraLabel}</Badge>
            </div>
            <p className="font-body text-sm text-muted-foreground mb-1">{year}</p>
            <h1 className="font-serif-display text-3xl md:text-4xl text-foreground mb-6">{title}</h1>
            <div className="rounded-xl border border-border bg-card p-6 font-body text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {details}
            </div>
            <p className="mt-8 text-center font-body text-xs text-muted-foreground">
              {isAr ? "صفحة مفصلة ستتوفر قريباً إن شاء الله" : "A detailed page will be available soon, in shaa Allah."}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Rich detail page ──
  const ev = richEvent!;
  const title = isAr ? ev.titleAr : ev.titleEn;
  const summary = isAr ? ev.summaryAr : ev.summaryEn;
  const year = isAr ? ev.yearAr : ev.yearEn;
  const hijri = isAr ? ev.hijriYearAr : ev.hijriYearEn;
  const eraLabel =
    ev.era === "makkah"
      ? isAr ? "العهد المكي" : "Makkan Period"
      : isAr ? "العهد المدني" : "Madinan Period";
  const catLabel = categoryLabels[ev.category]?.[isAr ? "ar" : "en"] || ev.category;
  const catColor = categoryColors[ev.category] || "bg-muted text-muted-foreground";

  const relatedBasic = ev.relatedEventIds
    .map((rid) => timelineEvents.find((te) => te.id === rid))
    .filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Hero gradient */}
      <div
        className="w-full h-56 md:h-72"
        style={{
          background:
            ev.era === "makkah"
              ? "linear-gradient(135deg, hsl(48 44% 92%), hsl(46 56% 78%))"
              : "linear-gradient(135deg, hsl(160 40% 90%), hsl(160 50% 78%))",
        }}
      />

      {/* Header */}
      <div className="container mx-auto px-4 md:px-6 max-w-3xl -mt-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button
            onClick={() => navigate("/journey")}
            className="inline-flex items-center gap-1.5 text-sm font-body text-foreground/70 hover:text-foreground mb-4 transition-colors"
          >
            <BackArrow size={16} />
            {isAr ? "العودة إلى الرحلة" : "Back to Journey"}
          </button>

          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Badge variant="outline" className={`text-xs font-body ${catColor} border-0`}>
              {catLabel}
            </Badge>
            <Badge variant="outline" className="text-xs font-body border-border">
              {eraLabel}
            </Badge>
          </div>

          <p className="font-body text-sm text-muted-foreground mb-1">
            <Calendar className="inline h-3.5 w-3.5 me-1 text-secondary" />
            {year}
            {hijri && <span className="ms-2 text-secondary">({hijri})</span>}
          </p>

          <h1 className="font-serif-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4">
            {title}
          </h1>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-3xl py-8 md:py-12 space-y-10">
        {/* Summary */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-body text-base md:text-lg text-muted-foreground leading-relaxed"
        >
          {summary}
        </motion.p>

        {/* Sections */}
        {ev.sections.map((sec, i) => {
          const SectionIcon = sec.icon ? iconMap[sec.icon] || BookOpen : BookOpen;
          return (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Separator className="mb-6" />
              <h2 className="font-serif-display text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
                <SectionIcon className="h-5 w-5 text-secondary" />
                {isAr ? sec.titleAr : sec.titleEn}
              </h2>
              <div className="font-body text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line rounded-xl border border-border bg-card p-6">
                {isAr ? sec.contentAr : sec.contentEn}
              </div>
            </motion.section>
          );
        })}

        {/* Quran References */}
        {ev.quranRefs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <Separator className="mb-6" />
            <h2 className="font-serif-display text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-secondary" />
              {isAr ? "آيات قرآنية" : "Quranic Verses"}
            </h2>
            <div className="space-y-4">
              {ev.quranRefs.map((ref, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-secondary/20 bg-secondary/5 p-5"
                >
                  <p className="font-body text-xs text-secondary font-semibold mb-2">
                    {isAr
                      ? `سورة ${ref.surah} — آية ${ref.ayah}`
                      : `Surah ${ref.surahEn} — Ayah ${ref.ayah}`}
                  </p>
                  <p className="font-serif-display text-lg text-foreground leading-relaxed">
                    {isAr ? ref.textAr : ref.textEn}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Hadith References */}
        {ev.hadithRefs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <Separator className="mb-6" />
            <h2 className="font-serif-display text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
              <Quote className="h-5 w-5 text-secondary" />
              {isAr ? "أحاديث نبوية" : "Hadith References"}
            </h2>
            <div className="space-y-4">
              {ev.hadithRefs.map((ref, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-border bg-muted/30 p-5"
                >
                  <p className="font-body text-xs text-secondary font-semibold mb-2">
                    {isAr ? ref.sourceAr : ref.sourceEn}
                  </p>
                  <p className="font-body text-sm md:text-base text-foreground leading-relaxed italic">
                    {isAr ? ref.textAr : ref.textEn}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Related Events */}
        {relatedBasic.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <Separator className="mb-6" />
            <h2 className="font-serif-display text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
              <Link2 className="h-5 w-5 text-secondary" />
              {isAr ? "أحداث مرتبطة" : "Related Events"}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedBasic.map((re) => (
                <Link
                  key={re!.id}
                  to={`/event/${re!.id}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-secondary/30 transition-all group"
                >
                  <span className="w-3 h-3 rounded-full flex-shrink-0 bg-secondary" />
                  <div>
                    <p className="font-body text-sm text-foreground group-hover:text-secondary transition-colors">
                      {isAr ? re!.title : re!.titleEn}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {isAr ? re!.year : re!.yearEn}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Sources */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
        >
          <Separator className="mb-6" />
          <h2 className="font-serif-display text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-secondary" />
            {isAr ? "المصادر والمراجع" : "Sources & References"}
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            {ev.sources.map((src, i) => (
              <div key={i} className="flex items-start gap-3">
                <Scroll className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">
                    {isAr ? src.titleAr : src.titleEn}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {isAr ? src.authorAr : src.authorEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default EventDetailPage;
