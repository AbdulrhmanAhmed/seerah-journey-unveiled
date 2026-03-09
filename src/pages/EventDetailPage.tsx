import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Quote, Link2, MapPin, Calendar, BookMarked, Scroll } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface QuranReference {
  surah: string;
  ayah: string;
  text: string;
  text_en: string;
}

interface HadithReference {
  source: string;
  text: string;
  text_en: string;
}

interface RelatedEvent {
  id: string;
  title: string;
  title_en: string;
  year_ce: number;
  category: string;
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

  const [event, setEvent] = useState<any | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<RelatedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("id", id)
        .single();

      if (!data) {
        navigate("/journey", { replace: true });
        return;
      }
      setEvent(data);

      const relIds = (data.related_event_ids as string[]) || [];
      if (relIds.length > 0) {
        const { data: relData } = await supabase
          .from("timeline_events")
          .select("id, title, title_en, year_ce, category")
          .in("id", relIds);
        setRelatedEvents((relData || []) as RelatedEvent[]);
      } else {
        setRelatedEvents([]);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-40 w-full" />
        </div>
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

  const title = isAr ? event.title : event.title_en;
  const description = isAr ? event.description : event.description_en;
  const fullStory = isAr ? event.full_story : event.full_story_en;
  const eraLabel = event.era === "makkah"
    ? (isAr ? "العهد المكي" : "Makkan Period")
    : (isAr ? "العهد المدني" : "Madinan Period");
  const catLabel = categoryLabels[event.category]?.[isAr ? "ar" : "en"] || event.category;
  const catColor = categoryColors[event.category] || "bg-muted text-muted-foreground";

  const quranRefs: QuranReference[] = event.quran_references || [];
  const hadithRefs: HadithReference[] = event.hadith_references || [];
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative">
        {event.image_url ? (
          <div className="w-full h-64 md:h-80 overflow-hidden">
            <img src={event.image_url} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        ) : (
          <div
            className="w-full h-48 md:h-64"
            style={{
              background: event.era === "makkah"
                ? "linear-gradient(135deg, hsl(48 44% 92%), hsl(46 56% 82%))"
                : "linear-gradient(135deg, hsl(160 40% 90%), hsl(160 50% 80%))",
            }}
          />
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl pb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-sm font-body text-foreground/70 hover:text-foreground mb-4 transition-colors"
              >
                <BackArrow size={16} />
                {isAr ? "العودة" : "Back"}
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
                {event.year_ce} {isAr ? "م" : "CE"}
                {event.year_hijri && (
                  <span className="ms-2 text-secondary">
                    ({event.year_hijri} {isAr ? "هـ" : "AH"})
                  </span>
                )}
              </p>

              <h1 className="font-serif-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                {title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-3xl py-8 md:py-12 space-y-10">
        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            {description}
          </motion.p>
        )}

        {/* Full Story */}
        {fullStory && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="font-serif-display text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-secondary" />
              {isAr ? "القصة الكاملة" : "Full Story"}
            </h2>
            <div className="font-body text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line rounded-xl border border-border bg-card p-6">
              {fullStory}
            </div>
          </motion.section>
        )}

        {/* Quran References */}
        {quranRefs.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Separator className="mb-6" />
            <h2 className="font-serif-display text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-secondary" />
              {isAr ? "آيات قرآنية" : "Quranic Verses"}
            </h2>
            <div className="space-y-4">
              {quranRefs.map((ref, i) => (
                <div key={i} className="rounded-xl border border-secondary/20 bg-secondary/5 p-5">
                  <p className="font-body text-xs text-secondary font-semibold mb-2">
                    {isAr ? `سورة ${ref.surah} — آية ${ref.ayah}` : `Surah ${ref.surah} — Ayah ${ref.ayah}`}
                  </p>
                  <p className="font-serif-display text-lg text-foreground leading-relaxed">
                    {isAr ? ref.text : ref.text_en}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Hadith References */}
        {hadithRefs.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Separator className="mb-6" />
            <h2 className="font-serif-display text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
              <Quote className="h-5 w-5 text-secondary" />
              {isAr ? "أحاديث نبوية" : "Hadith References"}
            </h2>
            <div className="space-y-4">
              {hadithRefs.map((ref, i) => (
                <div key={i} className="rounded-xl border border-border bg-muted/30 p-5">
                  <p className="font-body text-xs text-secondary font-semibold mb-2">
                    {ref.source}
                  </p>
                  <p className="font-body text-sm md:text-base text-foreground leading-relaxed italic">
                    {isAr ? ref.text : ref.text_en}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
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
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        re.category === "milestone" ? "hsl(var(--secondary))" :
                        re.category === "battle" ? "hsl(var(--destructive))" :
                        re.category === "contract" ? "hsl(200 60% 50%)" :
                        "hsl(var(--secondary))",
                    }}
                  />
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

        {/* Location link */}
        {event.location_id && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
            <MapPin className="h-4 w-4 text-secondary" />
            {isAr ? "الموقع:" : "Location:"}{" "}
            <Link to="/map" className="text-secondary hover:underline">
              {event.location_id}
            </Link>
          </div>
        )}

        {/* Scholarly Sources */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Separator className="mb-6" />
          <h2 className="font-serif-display text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-secondary" />
            {isAr ? "المصادر والمراجع" : "Sources & References"}
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-start gap-3">
              <Scroll className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="font-body text-sm font-semibold text-foreground">
                  {isAr ? "الرحيق المختوم" : "The Sealed Nectar (Ar-Raheeq Al-Makhtum)"}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {isAr ? "صفي الرحمن المباركفوري" : "Safiur-Rahman Al-Mubarakpuri"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Scroll className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="font-body text-sm font-semibold text-foreground">
                  {isAr ? "سيرة ابن هشام" : "Ibn Hisham's Seerah"}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {isAr ? "عبد الملك بن هشام" : "Abdul-Malik Ibn Hisham"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Scroll className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="font-body text-sm font-semibold text-foreground">
                  {isAr ? "صحيح البخاري" : "Sahih al-Bukhari"}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {isAr ? "الإمام محمد بن إسماعيل البخاري" : "Imam Muhammad ibn Ismail al-Bukhari"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Scroll className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="font-body text-sm font-semibold text-foreground">
                  {isAr ? "صحيح مسلم" : "Sahih Muslim"}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {isAr ? "الإمام مسلم بن الحجاج" : "Imam Muslim ibn al-Hajjaj"}
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default EventDetailPage;
