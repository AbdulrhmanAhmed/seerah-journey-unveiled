import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { badrData } from "@/data/badrBattleData";

const BadrTacticalMap = () => {
  const { lang } = useLanguage();
  const [activePoint, setActivePoint] = useState<string | null>(null);
  const activeData = badrData.mapPoints.find((p) => p.id === activePoint);

  return (
    <div>
      <h2 className="font-serif-display text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
        {lang === "ar" ? "خريطة ساحة المعركة" : "Tactical Battlefield Map"}
      </h2>
      <p className="text-center text-muted-foreground text-sm mb-8">
        {lang === "ar" ? "اضغط على النقاط لمعرفة التفاصيل" : "Click on the points to learn more"}
      </p>

      <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border" style={{ background: "linear-gradient(180deg, #1F2937 0%, #374151 50%, #D2B48C 100%)" }}>
        <svg viewBox="0 0 100 80" className="w-full h-auto" style={{ minHeight: 320 }}>
          {/* Terrain labels */}
          <text x="22" y="12" fill="#D4AF37" fontSize="3" fontFamily="Amiri, serif" textAnchor="middle" opacity="0.7">
            {lang === "ar" ? "العُدوة الدُّنيا" : "Nearer Bank"}
          </text>
          <text x="78" y="12" fill="#991B1B" fontSize="3" fontFamily="Amiri, serif" textAnchor="middle" opacity="0.7">
            {lang === "ar" ? "العُدوة القُصوى" : "Farther Bank"}
          </text>

          {/* Valley / wells line */}
          <line x1="50" y1="15" x2="50" y2="75" stroke="#60A5FA" strokeWidth="0.4" strokeDasharray="2 1" opacity="0.3" />
          <text x="50" y="78" fill="#60A5FA" fontSize="2" textAnchor="middle" opacity="0.5">
            {lang === "ar" ? "وادي بدر" : "Badr Valley"}
          </text>

          {/* Sand dune shapes */}
          <ellipse cx="25" cy="60" rx="18" ry="6" fill="#D2B48C" opacity="0.15" />
          <ellipse cx="75" cy="60" rx="18" ry="6" fill="#D2B48C" opacity="0.15" />

          {/* Interactive points */}
          {badrData.mapPoints.map((point) => {
            const isMuslim = point.id === "muslim_camp" || point.id === "arish";
            const isWells = point.id === "wells";
            const baseColor = isMuslim ? "#064E3B" : isWells ? "#D4AF37" : "#991B1B";
            const isActive = activePoint === point.id;

            return (
              <g
                key={point.id}
                className="cursor-pointer"
                onClick={() => setActivePoint(isActive ? null : point.id)}
              >
                {/* Pulse ring */}
                <circle cx={point.x} cy={point.y} r="3.5" fill="none" stroke={baseColor} strokeWidth="0.3" opacity="0.4">
                  <animate attributeName="r" from="2" to="5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* Dot */}
                <circle cx={point.x} cy={point.y} r="2" fill={baseColor} stroke="white" strokeWidth="0.4" />
                {/* Label */}
                <text
                  x={point.x}
                  y={point.y - 4}
                  fill="white"
                  fontSize="2.2"
                  textAnchor="middle"
                  fontFamily="'Noto Kufi Arabic', sans-serif"
                  className="pointer-events-none select-none"
                >
                  {point.label[lang]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Info Popup */}
        <AnimatePresence>
          {activeData && (
            <motion.div
              key={activeData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 rounded-xl border border-border p-5 shadow-xl"
              style={{ background: "hsl(var(--card))", backdropFilter: "blur(12px)" }}
            >
              <button
                onClick={() => setActivePoint(null)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              <h4 className="font-serif-display text-lg font-bold text-foreground mb-2">
                {activeData.label[lang]}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeData.description[lang]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BadrTacticalMap;
