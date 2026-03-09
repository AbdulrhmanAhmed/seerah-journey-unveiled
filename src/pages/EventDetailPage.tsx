import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Quote,
  Link2,
  Calendar,
  BookMarked,
  Loader2,
  Network,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { timelineEvents } from "@/data/seerahTimeline";
import EventRelationshipGraph from "@/components/EventRelationshipGraph";

interface QuranRef {
  surah: string;
  surahEn: string;
  ayah: string;
  textAr: string;
  textEn: string;
}

interface HadithRef {
  sourceAr: string;
  sourceEn: string;
  textAr: string;
  textEn: string;
}

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

  const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event-detail", id],
    queryFn: async () => {
      const identifier = id!;
      const column = isUuid(identifier) ? "id" : "slug";

      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .eq(column, identifier)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch related events
  const relatedIds = (event?.related_event_ids as string[]) || [];
  const { data: relatedEvents = [] } = useQuery({
    queryKey: ["related-events", relatedIds],
    queryFn: async () => {
      if (relatedIds.length === 0) return [];
      const { data, error } = await supabase
        .from("timeline_events")
        .select("id, title, title_en, year_ce, year_hijri, era, slug, category")
        .in("id", relatedIds);
      if (error) throw error;
      return data;
    },
    enabled: relatedIds.length > 0,
  });

  // Fetch nearby events for graph (current + related + their connections)
  const { data: graphEvents = [] } = useQuery({
    queryKey: ["graph-events-local", event?.id],
    queryFn: async () => {
      if (!event) return [];
      // Get a wider set: events from same era or within ±10 years
      const { data, error } = await supabase
        .from("timeline_events")
        .select("id, title, title_en, slug, year_ce, era, category, related_event_ids")
        .eq("is_active", true)
        .gte("year_ce", event.year_ce - 10)
        .lte("year_ce", event.year_ce + 10)
        .order("year_ce");
      if (error) throw error;
      return (data || []).map((e) => ({
        ...e,
        related_event_ids: (e.related_event_ids as string[]) || [],
      }));
    },
    enabled: !!event && relatedIds.length > 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-4">
          <h1 className="font-serif-display text-2xl md:text-3xl text-foreground">
            {isAr ? "الحدث غير موجود" : "Event not found"}
          </h1>
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

  const identifier = id ?? "";
  const localFallback =
    identifier && !isUuid(identifier)
      ? timelineEvents.find((e) => e.id === identifier)
      : event?.slug
        ? timelineEvents.find((e) => e.id === event.slug)
        : undefined;

  const title = isAr ? event.title : event.title_en;
  const description = isAr ? event.description : event.description_en;
  const fullStory = isAr ? event.full_story : event.full_story_en;

  const effectiveDescription =
    (description ?? "").trim() ||
    (localFallback ? (isAr ? localFallback.summary : localFallback.summaryEn) : "");

  const effectiveFullStory =
    (fullStory ?? "").trim() ||
    (localFallback ? (isAr ? localFallback.details : localFallback.detailsEn) : "");

  const eraLabel =
    event.era === "makkah"
      ? isAr
        ? "العهد المكي"
        : "Makkan Period"
      : isAr
        ? "العهد المدني"
        : "Madinan Period";
  const catLabel = categoryLabels[event.category]?.[isAr ? "ar" : "en"] || event.category;
  const catColor = categoryColors[event.category] || "bg-muted text-muted-foreground";

  const quranRefs = (event.quran_references as unknown as QuranRef[]) || [];
  const hadithRefs = (event.hadith_references as unknown as HadithRef[]) || [];

  return (
    <div className="min-h-screen">
      {/* Hero gradient */}
      <div
        className="w-full h-56 md:h-72"
        style={{
          background:
            event.era === "makkah"
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
            {event.is_major && (
              <Badge variant="outline" className="text-xs font-body bg-secondary/15 text-secondary border-0">
                {isAr ? "حدث رئيسي" : "Major Event"}
              </Badge>
            )}
          </div>

          <p className="font-body text-sm text-muted-foreground mb-1">
            <Calendar className="inline h-3.5 w-3.5 me-1 text-secondary" />
            {event.year_ce} {isAr ? "م" : "CE"}
            {event.year_hijri && <span className="ms-2 text-secondary">({event.year_hijri})</span>}
          </p>

          <h1 className="font-serif-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4">
            {title}
          </h1>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-3xl py-8 md:py-12 space-y-10">
        {/* Description / Summary */}
        {effectiveDescription && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            {effectiveDescription}
          </motion.p>
        )}

        {/* Full Story */}
        {effectiveFullStory && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <Separator className="mb-6" />
            <h2 className="font-serif-display text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-secondary" />
              {isAr ? "القصة الكاملة" : "Full Story"}
            </h2>
            <div className="font-body text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line rounded-xl border border-border bg-card p-6">
              {effectiveFullStory}
            </div>
          </motion.section>
        )}

        {/* Quran References */}
        {quranRefs.length > 0 && (
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
              {quranRefs.map((ref, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-secondary/20 bg-secondary/5 p-5"
                >
                  <p className="font-body text-xs text-secondary font-semibold mb-2">
                    {isAr ? `سورة ${ref.surah} — آية ${ref.ayah}` : `Surah ${ref.surahEn} — Ayah ${ref.ayah}`}
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
        {hadithRefs.length > 0 && (
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
              {hadithRefs.map((ref, i) => (
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

        {/* Sources & Documentation */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
        >
          <Separator className="mb-6" />
          <h2 className="font-serif-display text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-secondary" />
            {isAr ? "المصادر والتوثيق" : "Sources & Documentation"}
          </h2>
          <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
            {isAr
              ? "جميع المحتوى في Seerah Path مبني على مصادر علمية موثوقة. نعتمد على أعمال كلاسيكية مثل الرحيق المختوم، وسيرة ابن هشام، ومصنفات الحديث المعتمدة."
              : "All content in Seerah Path is built on verified scholarly sources. We rely on classical works such as The Sealed Nectar, Ibn Hisham's Seerah, and authenticated hadith collections."}
          </p>
          <ul className="mt-4 space-y-1 ps-5 list-disc font-body text-sm text-muted-foreground">
            <li>{isAr ? "الرحيق المختوم (Ar-Raheeq Al-Makhtum)" : "The Sealed Nectar (Ar-Raheeq Al-Makhtum)"}</li>
            <li>{isAr ? "سيرة ابن هشام" : "Ibn Hisham's Seerah"}</li>
            <li>{isAr ? "صحيح البخاري" : "Sahih al-Bukhari"}</li>
            <li>{isAr ? "صحيح مسلم" : "Sahih Muslim"}</li>
          </ul>
          {(quranRefs.length === 0 || hadithRefs.length === 0) && (
            <p className="mt-4 font-body text-xs text-muted-foreground">
              {isAr
                ? "ستظهر هنا المراجع الخاصة بالحدث (الآيات والأحاديث) عند إضافتها من لوحة الإدارة."
                : "Event-specific Quran/Hadith references will appear here once added from the Admin panel."}
            </p>
          )}
        </motion.section>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
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
              {relatedEvents.map((re) => (
                <Link
                  key={re.id}
                  to={`/event/${re.id}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-secondary/30 transition-all group"
                >
                  <span className="w-3 h-3 rounded-full flex-shrink-0 bg-secondary" />
                  <div>
                    <p className="font-body text-sm text-foreground group-hover:text-secondary transition-colors">
                      {isAr ? re.title : re.title_en}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {re.year_ce} {isAr ? "م" : "CE"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* No detailed content message */}
        {!effectiveFullStory && quranRefs.length === 0 && hadithRefs.length === 0 && (
          <p className="mt-8 text-center font-body text-xs text-muted-foreground">
            {isAr ? "صفحة مفصلة ستتوفر قريباً إن شاء الله" : "A detailed page will be available soon, in shaa Allah."}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
