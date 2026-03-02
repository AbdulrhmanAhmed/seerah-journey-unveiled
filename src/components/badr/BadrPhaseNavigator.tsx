import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tent, CloudRain, Swords, Sparkles, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { badrData } from "@/data/badrBattleData";

const iconMap: Record<string, React.ElementType> = {
  Tent,
  CloudRain,
  Swords,
  Sparkles,
  BookOpen,
};

const BadrPhaseNavigator = () => {
  const { lang, isRtl } = useLanguage();
  const [activePhase, setActivePhase] = useState(0);
  const phases = badrData.phases;
  const phase = phases[activePhase];
  const Icon = iconMap[phase.icon] || BookOpen;

  const next = () => setActivePhase((p) => Math.min(p + 1, phases.length - 1));
  const prev = () => setActivePhase((p) => Math.max(p - 1, 0));

  return (
    <div>
      <h2 className="font-serif-display text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
        {lang === "ar" ? "مراحل المعركة الخمس" : "The Five Phases of Battle"}
      </h2>
      <p className="text-center text-muted-foreground text-sm mb-10">
        {lang === "ar" ? "تنقل بين المراحل لاستكشاف أحداث المعركة" : "Navigate through phases to explore the battle events"}
      </p>

      {/* Phase selector pills */}
      <div className="flex justify-center gap-2 md:gap-3 mb-8 flex-wrap">
        {phases.map((p, i) => {
          const PIcon = iconMap[p.icon] || BookOpen;
          const isActive = i === activePhase;
          return (
            <button
              key={p.id}
              onClick={() => setActivePhase(i)}
              className={`flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                isActive
                  ? "border-[#D4AF37] text-foreground shadow-md"
                  : "border-border text-muted-foreground hover:border-[#D4AF37]/50"
              }`}
              style={isActive ? { background: "rgba(212, 175, 55, 0.12)" } : {}}
            >
              <PIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{p.title[lang]}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Phase content */}
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 40 : -40 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-border p-6 md:p-10 bg-card"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(212, 175, 55, 0.15)" }}
              >
                <Icon className="w-5 h-5" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <span className="text-xs text-[#D4AF37] font-medium">
                  {lang === "ar" ? `المرحلة ${phase.id}` : `Phase ${phase.id}`}
                </span>
                <h3 className="font-serif-display text-xl md:text-2xl font-bold text-foreground leading-tight">
                  {phase.title[lang]}
                </h3>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4">{phase.subtitle[lang]}</p>

            <p className="text-sm md:text-base text-foreground/90 leading-relaxed mb-5">
              {phase.description[lang]}
            </p>

            {phase.quranRef && (
              <blockquote
                className="border-s-2 ps-4 py-2 rounded-e-lg text-sm italic text-muted-foreground mb-4"
                style={{ borderColor: "#D4AF37", background: "rgba(212, 175, 55, 0.05)" }}
              >
                {phase.quranRef[lang]}
              </blockquote>
            )}

            {phase.keyFigure && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: "#064E3B" }} />
                {lang === "ar" ? "الشخصية المحورية:" : "Key Figure:"}{" "}
                <span className="font-semibold text-foreground">{phase.keyFigure[lang]}</span>
              </div>
            )}

            {phase.stats && (
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { label: lang === "ar" ? "شهداء المسلمين" : "Muslim Martyrs", value: phase.stats.muslimMartyrs, color: "#064E3B" },
                  { label: lang === "ar" ? "قتلى قريش" : "Quraish Slain", value: phase.stats.quraishSlain, color: "#991B1B" },
                  { label: lang === "ar" ? "أسرى قريش" : "Quraish Prisoners", value: phase.stats.quraishPrisoners, color: "#D4AF37" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="text-center p-3 rounded-xl border border-border"
                    style={{ background: `${s.color}08` }}
                  >
                    <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prev}
            disabled={activePhase === 0}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {lang === "ar" ? "السابق" : "Previous"}
          </button>
          <span className="text-xs text-muted-foreground">
            {activePhase + 1} / {phases.length}
          </span>
          <button
            onClick={next}
            disabled={activePhase === phases.length - 1}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {lang === "ar" ? "التالي" : "Next"}
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadrPhaseNavigator;
