import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Shield, Footprints } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { badrData } from "@/data/badrBattleData";

const AnimatedCounter = ({ target, duration = 2 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
};

const AnimatedBar = ({ value, max, color, delay }: { value: number; max: number; color: string; delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const pct = (value / max) * 100;

  return (
    <div ref={ref} className="w-full bg-muted rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${pct}%` } : {}}
        transition={{ duration: 1.2, delay, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
};

const BadrForceComparison = () => {
  const { lang } = useLanguage();
  const { forces, comparisonLabel } = badrData;
  const maxMen = forces.quraish.men;
  const maxHorses = forces.quraish.horses;
  const maxCamels = forces.quraish.camels;

  const statRows = [
    { icon: Users, labelAr: "مقاتل", labelEn: "Men", muslim: forces.muslims.men, quraish: forces.quraish.men, max: maxMen },
    { icon: Shield, labelAr: "فرس", labelEn: "Horses", muslim: forces.muslims.horses, quraish: forces.quraish.horses, max: maxHorses },
    { icon: Footprints, labelAr: "بعير", labelEn: "Camels", muslim: forces.muslims.camels, quraish: forces.quraish.camels, max: maxCamels },
  ];

  return (
    <div>
      <h2 className="font-serif-display text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
        {lang === "ar" ? "ميزان القوى" : "Balance of Power"}
      </h2>
      <p className="text-center text-muted-foreground text-sm mb-8">{comparisonLabel[lang]}</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Muslims Card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "#064E3B", background: "linear-gradient(135deg, rgba(6,78,59,0.08), rgba(6,78,59,0.02))" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 rounded-full" style={{ background: "#064E3B" }} />
            <h3 className="font-serif-display text-xl font-bold text-foreground">{forces.muslims.label[lang]}</h3>
          </div>
          {statRows.map((row, i) => (
            <div key={row.labelEn} className="mb-5 last:mb-0">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <row.icon className="w-4 h-4" />
                  <span>{lang === "ar" ? row.labelAr : row.labelEn}</span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  <AnimatedCounter target={row.muslim} />
                </span>
              </div>
              <AnimatedBar value={row.muslim} max={row.max} color="#064E3B" delay={i * 0.2} />
            </div>
          ))}
        </motion.div>

        {/* Quraish Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "#991B1B", background: "linear-gradient(135deg, rgba(153,27,27,0.08), rgba(153,27,27,0.02))" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 rounded-full" style={{ background: "#991B1B" }} />
            <h3 className="font-serif-display text-xl font-bold text-foreground">{forces.quraish.label[lang]}</h3>
          </div>
          {statRows.map((row, i) => (
            <div key={row.labelEn} className="mb-5 last:mb-0">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <row.icon className="w-4 h-4" />
                  <span>{lang === "ar" ? row.labelAr : row.labelEn}</span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  <AnimatedCounter target={row.quraish} />
                </span>
              </div>
              <AnimatedBar value={row.quraish} max={row.max} color="#991B1B" delay={i * 0.2} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BadrForceComparison;
