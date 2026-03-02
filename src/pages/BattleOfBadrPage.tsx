import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { badrData } from "@/data/badrBattleData";
import BadrForceComparison from "@/components/badr/BadrForceComparison";
import BadrTacticalMap from "@/components/badr/BadrTacticalMap";
import BadrPhaseNavigator from "@/components/badr/BadrPhaseNavigator";

const BattleOfBadrPage = () => {
  const { lang, isRtl } = useLanguage();
  const d = badrData;

  return (
    <div className="min-h-screen bg-background islamic-pattern">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32" style={{ background: "linear-gradient(165deg, #064E3B 0%, #0A3D2E 40%, #1F2937 100%)" }}>
        {/* Decorative geometric overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="badr-geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
                <circle cx="30" cy="30" r="4" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#badr-geo)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              {d.title[lang]}
            </h1>
            <p className="text-lg md:text-xl text-[#D4AF37] font-medium mb-8">
              {d.subtitle[lang]}
            </p>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl mx-auto border border-[#D4AF37]/30 rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(212, 175, 55, 0.08)", backdropFilter: "blur(8px)" }}
          >
            <p className="font-serif-display text-xl md:text-2xl text-white/95 leading-relaxed mb-3">
              {d.quranVerse[lang]}
            </p>
            <cite className="text-[#D4AF37]/80 text-sm not-italic">
              — {d.quranVerse.reference[lang]}
            </cite>
          </motion.blockquote>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Force Comparison */}
      <section className="container mx-auto px-4 -mt-8 relative z-10 mb-16">
        <BadrForceComparison />
      </section>

      {/* Tactical Map */}
      <section className="container mx-auto px-4 mb-20">
        <BadrTacticalMap />
      </section>

      {/* Phase Navigator */}
      <section className="container mx-auto px-4 mb-20">
        <BadrPhaseNavigator />
      </section>

      {/* Source Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm font-body">{d.source[lang]}</p>
        </div>
      </footer>
    </div>
  );
};

export default BattleOfBadrPage;
