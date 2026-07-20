import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export interface TacticalPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  label_en?: string;
  side?: "muslim" | "enemy" | "neutral";
  description?: string;
  description_en?: string;
  icon?: string;
}

export interface TacticalArrow {
  from: [number, number];
  to: [number, number];
  side?: "muslim" | "enemy" | "neutral";
  label?: string;
  label_en?: string;
}

export interface TacticalLabel {
  x: number;
  y: number;
  text: string;
  text_en?: string;
  color?: string;
  size?: number;
}

export interface TacticalMapData {
  terrain?: "desert" | "valley" | "mountains" | "urban" | "coast";
  labels?: TacticalLabel[];
  points?: TacticalPoint[];
  arrows?: TacticalArrow[];
  features?: Array<{ type: "line" | "ellipse" | "rect" | "path"; props: Record<string, any> }>;
}

const terrainGradients: Record<string, string> = {
  desert: "linear-gradient(180deg, #1F2937 0%, #4B5563 40%, #D2B48C 100%)",
  valley: "linear-gradient(180deg, #0F2A1F 0%, #3A5F3A 45%, #C9B98A 100%)",
  mountains: "linear-gradient(180deg, #1E293B 0%, #475569 45%, #78716C 100%)",
  urban: "linear-gradient(180deg, #292524 0%, #57534E 45%, #D6C7A3 100%)",
  coast: "linear-gradient(180deg, #0C4A6E 0%, #0EA5E9 45%, #E7D6A8 100%)",
};

const sideColor: Record<string, string> = {
  muslim: "hsl(158 64% 22%)",
  enemy: "hsl(0 65% 35%)",
  neutral: "hsl(45 85% 50%)",
};

const TacticalBattleMap = ({ data }: { data: TacticalMapData | null | undefined }) => {
  const { lang, t } = useLanguage();
  const [active, setActive] = useState<string | null>(null);
  const isAr = lang === "ar";

  const activePoint = useMemo(
    () => data?.points?.find((p) => p.id === active) || null,
    [active, data]
  );

  if (!data || !data.points || data.points.length === 0) return null;

  const terrain = data.terrain || "desert";

  return (
    <div>
      <p className="text-center text-muted-foreground text-sm mb-4">{t("battleTacticalHint")}</p>

      <div
        className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border shadow-lg"
        style={{ background: terrainGradients[terrain] }}
      >
        <svg viewBox="0 0 100 80" className="w-full h-auto" style={{ minHeight: 360 }}>
          <defs>
            <marker id="arrow-muslim" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={sideColor.muslim} />
            </marker>
            <marker id="arrow-enemy" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={sideColor.enemy} />
            </marker>
            <marker id="arrow-neutral" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={sideColor.neutral} />
            </marker>
          </defs>

          {/* Custom SVG features */}
          {data.features?.map((f, i) => {
            const P = f.props || {};
            if (f.type === "line") return <line key={i} {...P} />;
            if (f.type === "ellipse") return <ellipse key={i} {...P} />;
            if (f.type === "rect") return <rect key={i} {...P} />;
            if (f.type === "path") return <path key={i} {...P} />;
            return null;
          })}

          {/* Static labels */}
          {data.labels?.map((l, i) => (
            <text
              key={i}
              x={l.x}
              y={l.y}
              fill={l.color || "#F5E6C8"}
              fontSize={l.size || 3}
              fontFamily="Amiri, serif"
              textAnchor="middle"
              opacity="0.85"
            >
              {isAr ? l.text : l.text_en || l.text}
            </text>
          ))}

          {/* Arrows */}
          {data.arrows?.map((a, i) => {
            const side = a.side || "neutral";
            return (
              <g key={i}>
                <line
                  x1={a.from[0]}
                  y1={a.from[1]}
                  x2={a.to[0]}
                  y2={a.to[1]}
                  stroke={sideColor[side]}
                  strokeWidth="0.6"
                  strokeDasharray="1.5 1"
                  opacity="0.85"
                  markerEnd={`url(#arrow-${side})`}
                />
                {(a.label || a.label_en) && (
                  <text
                    x={(a.from[0] + a.to[0]) / 2}
                    y={(a.from[1] + a.to[1]) / 2 - 1}
                    fill={sideColor[side]}
                    fontSize="1.8"
                    textAnchor="middle"
                    fontFamily="Amiri, serif"
                  >
                    {isAr ? a.label : a.label_en || a.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Interactive points */}
          {data.points.map((p) => {
            const side = p.side || "neutral";
            const color = sideColor[side];
            const isActive = active === p.id;
            return (
              <g
                key={p.id}
                className="cursor-pointer"
                onClick={() => setActive(isActive ? null : p.id)}
              >
                <circle cx={p.x} cy={p.y} r="3" fill="none" stroke={color} strokeWidth="0.3" opacity="0.5">
                  <animate attributeName="r" from="2" to="5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.7" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={p.x} cy={p.y} r={isActive ? 2.6 : 2} fill={color} stroke="white" strokeWidth="0.4" />
                <text
                  x={p.x}
                  y={p.y - 3.5}
                  fill="white"
                  fontSize="2.2"
                  textAnchor="middle"
                  fontFamily="'Noto Kufi Arabic', Amiri, sans-serif"
                  className="pointer-events-none select-none"
                  style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.6)", strokeWidth: 0.3 }}
                >
                  {isAr ? p.label : p.label_en || p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute top-3 left-3 rounded-md bg-black/40 backdrop-blur-sm px-2.5 py-1.5 text-[11px] text-white flex gap-3">
          <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full inline-block" style={{ background: sideColor.muslim }} />{t("battleSideMuslim")}</span>
          <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full inline-block" style={{ background: sideColor.enemy }} />{t("battleSideEnemy")}</span>
          <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full inline-block" style={{ background: sideColor.neutral }} />{t("battleSideNeutral")}</span>
        </div>

        <AnimatePresence>
          {activePoint && (
            <motion.div
              key={activePoint.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 rounded-xl border border-border p-5 shadow-2xl"
              style={{ background: "hsl(var(--card))", backdropFilter: "blur(12px)" }}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                aria-label="close"
              >
                <X className="w-4 h-4" />
              </button>
              <h4 className="font-amiri text-lg font-bold text-foreground mb-2">
                {isAr ? activePoint.label : activePoint.label_en || activePoint.label}
              </h4>
              {(activePoint.description || activePoint.description_en) && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isAr ? activePoint.description : activePoint.description_en || activePoint.description}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TacticalBattleMap;
