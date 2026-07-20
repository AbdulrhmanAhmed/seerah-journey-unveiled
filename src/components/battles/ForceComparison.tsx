import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

interface Row {
  label: string;
  muslim?: number | null;
  enemy?: number | null;
}

const ForceComparison = ({ rows }: { rows: Row[] }) => {
  const { t } = useLanguage();
  const filtered = rows.filter((r) => (r.muslim ?? 0) > 0 || (r.enemy ?? 0) > 0);
  if (filtered.length === 0) return null;

  return (
    <div className="space-y-5">
      {filtered.map((r, i) => {
        const m = r.muslim || 0;
        const e = r.enemy || 0;
        const max = Math.max(m, e, 1);
        const mPct = (m / max) * 100;
        const ePct = (e / max) * 100;
        return (
          <div key={i}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>{t("battleSideMuslim")}</span>
              <span className="font-medium text-foreground">{r.label}</span>
              <span>{t("battleSideEnemy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex justify-end">
                <motion.div
                  className="h-6 rounded-l-md flex items-center justify-end px-2 text-xs font-semibold text-white"
                  style={{ background: "hsl(158 64% 30%)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${mPct}%` }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
                >
                  {m > 0 ? m.toLocaleString() : ""}
                </motion.div>
              </div>
              <div className="flex-1">
                <motion.div
                  className="h-6 rounded-r-md flex items-center px-2 text-xs font-semibold text-white"
                  style={{ background: "hsl(0 65% 40%)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${ePct}%` }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
                >
                  {e > 0 ? e.toLocaleString() : ""}
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ForceComparison;
