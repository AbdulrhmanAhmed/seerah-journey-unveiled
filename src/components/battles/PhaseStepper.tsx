import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

interface Phase {
  phase?: string;
  phase_en?: string;
  title?: string;
  title_en?: string;
  day?: string;
  description?: string;
  description_en?: string;
}

const PhaseStepper = ({ phases }: { phases: Phase[] }) => {
  const { lang, t, isRtl } = useLanguage();
  const isAr = lang === "ar";
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % phases.length);
    }, 2200);
    return () => clearInterval(id);
  }, [playing, phases.length]);

  if (!phases || phases.length === 0) return null;
  const p = phases[active] || {};
  const label = (ph: Phase) =>
    (isAr ? ph.phase || ph.title : ph.phase_en || ph.title_en || ph.phase || ph.title) || "";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 flex-wrap">
          {phases.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setPlaying(false); }}
              className={`h-2 rounded-full transition-all ${
                i === active ? "bg-secondary w-8" : "bg-muted w-4 hover:bg-muted-foreground/50"
              }`}
              aria-label={`phase ${i + 1}`}
            />
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPlaying(!playing)}
          className="gap-1.5 text-xs"
        >
          {playing ? <Pause size={12} /> : <Play size={12} />}
          {playing ? t("battlePausePhases") : t("battlePlayPhases")}
        </Button>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-4">
        {/* Rail */}
        <ol className={`relative ${isRtl ? "border-r-2 pr-4" : "border-l-2 pl-4"} border-secondary/30 space-y-3`}>
          {phases.map((ph, i) => (
            <li key={i} className="relative">
              <span
                className={`absolute ${isRtl ? "-right-[22px]" : "-left-[22px]"} top-1.5 w-3 h-3 rounded-full transition-all ${
                  i === active ? "bg-secondary ring-4 ring-secondary/20 scale-110" : "bg-muted"
                }`}
              />
              <button
                onClick={() => { setActive(i); setPlaying(false); }}
                className={`text-start w-full ${
                  i === active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="text-xs">{ph.day}</div>
                <div className="text-sm font-amiri">{label(ph)}</div>
              </button>
            </li>
          ))}
        </ol>

        {/* Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            {p.day && <div className="text-xs uppercase tracking-wide text-secondary mb-1">{p.day}</div>}
            <h4 className="font-amiri text-xl font-bold text-foreground mb-3">
              {label(p)}
            </h4>
            <p className="text-foreground/85 leading-loose whitespace-pre-line">
              {isAr ? p.description : p.description_en || p.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PhaseStepper;
