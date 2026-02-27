import { useLanguage } from "@/i18n/LanguageContext";
import { mapLocations } from "@/data/mapLocations";
import { categoryMap } from "@/data/eventCategories";
import type { MapLocation } from "@/data/mapLocations";
import type { EventCategory } from "@/data/eventCategories";
import type { MapPath } from "@/data/mapPaths";
import { useEffect, useRef, useState } from "react";

interface ArabianMapSVGProps {
  onLocationClick: (location: MapLocation) => void;
  selectedId: string | null;
  activeCategories: Set<EventCategory>;
  activePath?: MapPath | null;
  activeStep?: number;
}

const categoryIconPaths: Record<EventCategory, string> = {
  milestone: "M5 0.5L6.2 3.5L9.5 3.8L7 6L7.7 9.3L5 7.7L2.3 9.3L3 6L0.5 3.8L3.8 3.5Z",
  battle: "M1 9L4.5 5.5M4.5 5.5L3 1L5 3.5L7 1L5.5 5.5M5.5 5.5L9 9M4.5 5.5L5.5 5.5",
  contract: "M2.5 0.5H7.5V9.5H2.5ZM4 3H6M4 5H6M4 7H5.5",
  challenge: "M5 1.5A3.5 3.5 0 1 0 5 8.5A3.5 3.5 0 1 0 5 1.5M5 3.5V5.5M5 7V7.01",
  marriage: "M5 8.5C5 8.5 1 6 1 3.5C1 2 2.3 1 3.5 1C4.2 1 4.8 1.4 5 1.8C5.2 1.4 5.8 1 6.5 1C7.7 1 9 2 9 3.5C9 6 5 8.5 5 8.5Z",
  diplomacy: "M1 9L1 4L9 0.5L1 4L1 9L4 6L9 0.5",
};

const ArabianMapSVG = ({
  onLocationClick,
  selectedId,
  activeCategories,
  activePath,
  activeStep = -1,
}: ArabianMapSVGProps) => {
  const { t, lang } = useLanguage();
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [animatedLength, setAnimatedLength] = useState(0);

  // Build the SVG path string for the active path up to activeStep
  const getPathD = () => {
    if (!activePath) return "";
    const stepsToShow = activeStep >= 0 ? activePath.steps.slice(0, activeStep + 1) : activePath.steps;
    return stepsToShow.map((s, i) => `${i === 0 ? "M" : "L"} ${s.x} ${s.y}`).join(" ");
  };

  const pathD = getPathD();

  // Determine if current segment is sea
  const hasSeaSegment = activePath?.steps.some((s) => s.segmentType === "sea");

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      setAnimatedLength(0);
      // Animate drawing
      requestAnimationFrame(() => {
        setAnimatedLength(len);
      });
    }
  }, [pathD]);

  const visibleLocations = mapLocations.filter((loc) =>
    activeCategories.has(loc.primaryCategory)
  );

  // Determine which steps have sea segments for dashed rendering
  const getSegmentPaths = () => {
    if (!activePath) return [];
    const stepsToShow = activeStep >= 0 ? activePath.steps.slice(0, activeStep + 1) : activePath.steps;
    const segments: { d: string; isSea: boolean }[] = [];
    for (let i = 1; i < stepsToShow.length; i++) {
      const prev = stepsToShow[i - 1];
      const curr = stepsToShow[i];
      segments.push({
        d: `M ${prev.x} ${prev.y} L ${curr.x} ${curr.y}`,
        isSea: curr.segmentType === "sea",
      });
    }
    return segments;
  };

  const segments = getSegmentPaths();

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(46 56% 52%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(46 56% 52%)" stopOpacity="0" />
        </radialGradient>
        <filter id="stepGlow">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Peninsula */}
      <path
        d="M 25 20 Q 30 18, 40 20 L 55 22 Q 62 24, 65 30 L 68 38 Q 70 42, 68 48 L 65 55 Q 62 62, 58 68 L 52 75 Q 48 80, 42 82 L 35 80 Q 30 78, 28 74 L 25 68 Q 22 62, 20 55 L 18 45 Q 17 35, 20 28 Z"
        fill="hsl(48 44% 92%)"
        stroke="hsl(48 30% 78%)"
        strokeWidth="0.4"
        className="drop-shadow-sm"
      />
      {/* West coast water */}
      <path
        d="M 25 20 Q 22 30, 18 45 Q 17 55, 22 65 L 28 74 Q 30 78, 35 80 L 30 82 Q 24 78, 20 70 Q 14 58, 12 45 Q 11 32, 15 22 Z"
        fill="hsl(200 50% 88%)"
        fillOpacity="0.5"
        stroke="hsl(200 40% 75%)"
        strokeWidth="0.3"
      />
      {/* East coast water */}
      <path
        d="M 65 30 Q 70 32, 72 36 L 73 42 Q 72 48, 68 48 L 65 55 Q 68 50, 70 44 Q 72 38, 68 34 Z"
        fill="hsl(200 50% 88%)"
        fillOpacity="0.5"
        stroke="hsl(200 40% 75%)"
        strokeWidth="0.3"
      />

      {/* Region labels */}
      <text x="42" y="40" className="font-body" fontSize="2" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic">{t("regionNajd")}</text>
      <text x="30" y="55" className="font-body" fontSize="2" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic">{t("regionHijaz")}</text>
      <text x="55" y="70" className="font-body" fontSize="1.8" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic">{t("regionYemen")}</text>
      <text x="15" y="40" className="font-body" fontSize="1.5" fill="hsl(200 40% 70%)" textAnchor="middle" fontStyle="italic">{t("regionRedSea")}</text>
      <text x="58" y="82" className="font-body" fontSize="1.5" fill="hsl(48 30% 65%)" textAnchor="middle" fontStyle="italic">{t("regionHornOfAfrica")}</text>

      {/* Active path segments */}
      {activePath && segments.map((seg, i) => (
        <path
          key={`seg-${i}`}
          d={seg.d}
          fill="none"
          stroke={`hsl(${activePath.lineColor})`}
          strokeWidth="0.6"
          strokeDasharray={seg.isSea ? "1 0.8" : "none"}
          strokeLinecap="round"
          className="transition-all duration-700 ease-in-out"
          style={{
            animation: "dash 3s linear infinite",
            opacity: 0.9,
          }}
        />
      ))}

      {/* Step markers on path */}
      {activePath &&
        (activeStep >= 0 ? activePath.steps.slice(0, activeStep + 1) : activePath.steps).map(
          (step, i) => {
            const isCurrentStep = i === activeStep;
            return (
              <g key={`step-${i}`}>
                {isCurrentStep && (
                  <circle
                    cx={step.x}
                    cy={step.y}
                    r="2.5"
                    fill="none"
                    stroke={`hsl(${activePath.lineColor})`}
                    strokeWidth="0.3"
                    opacity="0.6"
                  >
                    <animate attributeName="r" values="1.5;3;1.5" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={step.x}
                  cy={step.y}
                  r="1"
                  fill={`hsl(${activePath.lineColor})`}
                  stroke="hsl(60 33% 97%)"
                  strokeWidth="0.2"
                />
                <text
                  x={step.x}
                  y={step.y + 0.4}
                  textAnchor="middle"
                  fontSize="0.9"
                  fill="hsl(60 33% 97%)"
                  fontWeight="700"
                  className="font-body pointer-events-none"
                >
                  {step.order}
                </text>
              </g>
            );
          }
        )}

      {/* Location markers */}
      {visibleLocations.map((loc) => {
        const catConfig = categoryMap[loc.primaryCategory];
        const catColor = `hsl(${catConfig.colorHsl})`;
        const isSelected = selectedId === loc.id;
        const iconPath = categoryIconPaths[loc.primaryCategory];
        const locName = lang === "ar" ? loc.name : loc.nameEn;

        return (
          <g
            key={loc.id}
            onClick={() => onLocationClick(loc)}
            className="cursor-pointer"
            role="button"
            aria-label={`${t("viewLocation")} ${locName}`}
            style={{ opacity: 1, transition: "opacity 0.3s ease" }}
          >
            <circle cx={loc.x} cy={loc.y} r="2.5" fill="url(#goldGlow)">
              <animate attributeName="r" values="1.5;3;1.5" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
            </circle>

            <circle
              cx={loc.x}
              cy={loc.y}
              r="1.6"
              fill={isSelected ? catColor : "hsl(60 33% 97%)"}
              stroke={catColor}
              strokeWidth="0.3"
              className="transition-all duration-200"
            />

            <g transform={`translate(${loc.x - 1}, ${loc.y - 1}) scale(0.2)`}>
              <path
                d={iconPath}
                fill="none"
                stroke={isSelected ? "hsl(60 33% 97%)" : catColor}
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            <text
              x={loc.x}
              y={loc.y - 3}
              textAnchor="middle"
              fontSize="1.8"
              fontWeight="600"
              fill="hsl(160 90% 16%)"
              className="font-body pointer-events-none"
            >
              {locName}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default ArabianMapSVG;
