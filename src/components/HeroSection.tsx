import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const stars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 3,
}));

const HeroSection = () => {
  const { t } = useLanguage();

  const scrollToContent = () => {
    const el = document.getElementById("pillars-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white/60 animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      <div className="absolute inset-0 islamic-pattern-dense opacity-30" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="mb-8">
            <div className="inline-block px-6 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
              <span className="text-white/60 text-sm font-body tracking-widest">
                {t("bismillah")}
              </span>
            </div>
          </div>

          <h1 className="font-serif-display text-4xl md:text-5xl lg:text-7xl text-white leading-tight mb-6">
            {t("heroTitle")}{" "}
            <span className="italic">{t("heroTitleItalic")}</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-4 leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <p className="font-body text-sm text-white/40 max-w-xl mx-auto mb-12">
            {t("heroDescription")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          <button
            onClick={scrollToContent}
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-secondary text-secondary-foreground font-medium text-sm tracking-wide transition-all duration-300 hover:shadow-lg gold-glow hover:scale-105"
          >
            {t("heroButton")}
            <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
