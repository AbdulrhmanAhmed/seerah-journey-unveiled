import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { yearJumpPoints, timelineEvents } from "@/data/seerahTimeline";

const YearQuickNav = () => {
  const { t, lang, isRtl } = useLanguage();

  const handleJump = (year: string) => {
    const event = timelineEvents.find((e) => e.year === year);
    if (event) {
      const el = document.getElementById(`event-${event.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-30 flex-col items-start gap-1 ${
        isRtl ? "right-6" : "left-6"
      }`}
    >
      <span className="text-xs font-body font-semibold text-muted-foreground mb-2">
        {t("quickNavJumpTo")}
      </span>
      {yearJumpPoints.map((point) => (
        <button
          key={point.year}
          onClick={() => handleJump(point.year)}
          className="group flex items-center gap-2 py-1 px-2 rounded-md hover:bg-secondary/10 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-border group-hover:bg-secondary transition-colors" />
          <span className="text-xs font-body text-muted-foreground group-hover:text-secondary transition-colors">
            {lang === "ar" ? point.label : point.labelEn}
          </span>
        </button>
      ))}
    </motion.div>
  );
};

export default YearQuickNav;
