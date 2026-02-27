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

  const getPathD = () => {
    if (!activePath) return "";
    const stepsToShow = activeStep >= 0 ? activePath.steps.slice(0, activeStep + 1) : activePath.steps;
    return stepsToShow.map((s, i) => `${i === 0 ? "M" : "L"} ${s.x} ${s.y}`).join(" ");
  };

  const pathD = getPathD();

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      setAnimatedLength(0);
      requestAnimationFrame(() => {
        setAnimatedLength(len);
      });
    }
  }, [pathD]);

  const visibleLocations = mapLocations.filter((loc) =>
    activeCategories.has(loc.primaryCategory)
  );

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
    <svg viewBox="0 0 200 150" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* Parchment texture filter */}
        <filter id="parchmentNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
        </filter>

        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(46 56% 52%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(46 56% 52%)" stopOpacity="0" />
        </radialGradient>

        {/* Gold shimmer for active path */}
        <linearGradient id="goldShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(46 56% 52%)" stopOpacity="0.4">
            <animate attributeName="stop-opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="hsl(46 80% 65%)" stopOpacity="0.9">
            <animate attributeName="stop-opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="hsl(46 56% 52%)" stopOpacity="0.4">
            <animate attributeName="stop-opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>

        <filter id="stepGlow">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Terrain shading gradient */}
        <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(48 44% 88%)" />
          <stop offset="100%" stopColor="hsl(48 44% 82%)" />
        </linearGradient>

        {/* Water gradient */}
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(200 50% 85%)" />
          <stop offset="100%" stopColor="hsl(200 50% 78%)" />
        </linearGradient>

        {/* Gold border pattern */}
        <pattern id="goldBorder" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="none" />
          <path d="M0 5 Q2.5 0 5 5 Q7.5 10 10 5" fill="none" stroke="hsl(46 56% 52%)" strokeWidth="0.3" opacity="0.5" />
        </pattern>
      </defs>

      {/* Parchment background */}
      <rect x="0" y="0" width="200" height="150" fill="hsl(48 44% 92%)" filter="url(#parchmentNoise)" />

      {/* Gold-foil decorative border */}
      <rect x="1" y="1" width="198" height="148" fill="none" stroke="hsl(46 56% 52%)" strokeWidth="0.5" opacity="0.4" rx="2" />
      <rect x="3" y="3" width="194" height="144" fill="none" stroke="hsl(46 56% 52%)" strokeWidth="0.3" opacity="0.25" rx="1.5" />
      {/* Corner ornaments */}
      {[
        { x: 3, y: 3 }, { x: 197, y: 3 }, { x: 3, y: 147 }, { x: 197, y: 147 }
      ].map((corner, i) => (
        <g key={`corner-${i}`} transform={`translate(${corner.x}, ${corner.y}) scale(${i % 2 === 0 ? 1 : -1}, ${i < 2 ? 1 : -1})`}>
          <path d="M0 0 Q3 0 3 3" fill="none" stroke="hsl(46 56% 52%)" strokeWidth="0.4" opacity="0.5" />
          <circle cx="0" cy="0" r="0.6" fill="hsl(46 56% 52%)" opacity="0.4" />
        </g>
      ))}

      {/* Animated clouds overlay */}
      <g className="map-clouds" opacity="0.08">
        <ellipse cx="40" cy="25" rx="18" ry="4" fill="hsl(0 0% 100%)">
          <animateTransform attributeName="transform" type="translate" values="0,0;30,2;0,0" dur="60s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="130" cy="45" rx="22" ry="5" fill="hsl(0 0% 100%)">
          <animateTransform attributeName="transform" type="translate" values="0,0;-25,1;0,0" dur="80s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="80" cy="70" rx="15" ry="3" fill="hsl(0 0% 100%)">
          <animateTransform attributeName="transform" type="translate" values="0,0;20,-1;0,0" dur="50s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="160" cy="90" rx="20" ry="4" fill="hsl(0 0% 100%)">
          <animateTransform attributeName="transform" type="translate" values="0,0;-15,2;0,0" dur="70s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* === WATER BODIES === */}
      {/* Red Sea */}
      <path
        d="M 30 15 Q 25 30, 22 50 Q 18 65, 20 80 Q 22 90, 25 100 Q 28 108, 35 115 L 28 118 Q 18 108, 14 95 Q 10 80, 12 60 Q 14 40, 20 25 Q 24 15, 30 12 Z"
        fill="url(#waterGrad)"
        fillOpacity="0.4"
        stroke="hsl(200 40% 70%)"
        strokeWidth="0.3"
      />
      {/* Persian Gulf */}
      <path
        d="M 135 35 Q 140 32, 148 34 Q 155 36, 158 42 L 156 48 Q 152 52, 145 50 Q 140 48, 137 44 Z"
        fill="url(#waterGrad)"
        fillOpacity="0.4"
        stroke="hsl(200 40% 70%)"
        strokeWidth="0.3"
      />
      {/* Mediterranean Sea (top) */}
      <path
        d="M 10 5 L 80 5 Q 85 8, 80 12 L 40 15 Q 25 14, 15 10 Z"
        fill="url(#waterGrad)"
        fillOpacity="0.35"
        stroke="hsl(200 40% 70%)"
        strokeWidth="0.3"
      />
      {/* Gulf of Aden / Indian Ocean */}
      <path
        d="M 35 115 Q 50 120, 75 118 Q 100 115, 120 112 L 125 118 Q 100 125, 70 128 Q 45 130, 30 125 Z"
        fill="url(#waterGrad)"
        fillOpacity="0.35"
        stroke="hsl(200 40% 70%)"
        strokeWidth="0.3"
      />
      {/* Abyssinian coast water */}
      <path
        d="M 28 118 Q 25 125, 18 135 L 10 140 L 5 135 Q 10 125, 18 115 Z"
        fill="url(#waterGrad)"
        fillOpacity="0.35"
        stroke="hsl(200 40% 70%)"
        strokeWidth="0.3"
      />

      {/* === LANDMASSES === */}
      {/* Arabian Peninsula - expanded */}
      <path
        d="M 50 30 Q 60 25, 80 28 L 110 32 Q 125 35, 135 40 L 140 50 Q 142 58, 138 68 L 130 80 Q 120 92, 108 102 L 95 110 Q 82 115, 70 115 L 55 112 Q 42 108, 35 100 L 30 90 Q 26 78, 25 65 L 24 50 Q 25 38, 35 32 Z"
        fill="url(#terrainGrad)"
        stroke="hsl(48 30% 72%)"
        strokeWidth="0.4"
        className="drop-shadow-sm"
      />

      {/* Terrain highlights - mountain ranges */}
      <path d="M 45 55 Q 50 50, 55 52 Q 60 54, 58 58 Q 52 60, 45 55 Z" fill="hsl(48 30% 80%)" opacity="0.5" />
      <path d="M 65 40 Q 72 36, 78 38 Q 82 42, 75 45 Q 68 44, 65 40 Z" fill="hsl(48 30% 80%)" opacity="0.4" />
      
      {/* Sham / Levant region */}
      <path
        d="M 40 10 Q 50 8, 65 10 L 80 14 Q 85 18, 82 24 L 70 28 Q 55 30, 45 28 L 38 22 Q 35 16, 40 10 Z"
        fill="hsl(48 44% 88%)"
        stroke="hsl(48 30% 75%)"
        strokeWidth="0.3"
      />

      {/* Egypt / North Africa */}
      <path
        d="M 10 12 Q 20 10, 35 12 L 38 18 Q 35 28, 28 35 L 22 40 Q 15 38, 12 30 Q 10 22, 10 12 Z"
        fill="hsl(48 44% 86%)"
        stroke="hsl(48 30% 75%)"
        strokeWidth="0.3"
      />

      {/* Persia (east) */}
      <path
        d="M 140 18 Q 155 15, 170 18 L 180 25 Q 185 35, 180 45 L 165 50 Q 155 48, 148 42 Q 140 35, 138 28 Z"
        fill="hsl(48 44% 86%)"
        stroke="hsl(48 30% 75%)"
        strokeWidth="0.3"
      />

      {/* Abyssinia (Horn of Africa) */}
      <path
        d="M 20 115 Q 30 108, 45 110 L 60 115 Q 68 120, 65 128 L 50 135 Q 38 138, 28 135 L 18 128 Q 15 122, 20 115 Z"
        fill="hsl(130 20% 82%)"
        stroke="hsl(130 20% 68%)"
        strokeWidth="0.3"
      />

      {/* Iraq / Mesopotamia */}
      <path
        d="M 110 15 Q 120 12, 135 14 L 140 20 Q 142 28, 138 32 L 125 35 Q 115 34, 108 28 Q 105 22, 110 15 Z"
        fill="hsl(48 44% 86%)"
        stroke="hsl(48 30% 75%)"
        strokeWidth="0.3"
      />

      {/* === REGION LABELS === */}
      <text x="80" y="60" className="font-body" fontSize="3.5" fill="hsl(48 30% 65%)" textAnchor="middle" fontStyle="italic">{t("regionNajd")}</text>
      <text x="45" y="78" className="font-body" fontSize="3.5" fill="hsl(48 30% 65%)" textAnchor="middle" fontStyle="italic">{t("regionHijaz")}</text>
      <text x="95" y="105" className="font-body" fontSize="3" fill="hsl(48 30% 65%)" textAnchor="middle" fontStyle="italic">{t("regionYemen")}</text>
      <text x="18" y="55" className="font-body" fontSize="2.5" fill="hsl(200 40% 65%)" textAnchor="middle" fontStyle="italic">{t("regionRedSea")}</text>
      <text x="42" y="130" className="font-body" fontSize="2.5" fill="hsl(130 20% 55%)" textAnchor="middle" fontStyle="italic">{t("regionHornOfAfrica")}</text>
      <text x="60" y="18" className="font-body" fontSize="2.5" fill="hsl(48 30% 65%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "بلاد الشام" : "Levant"}
      </text>
      <text x="165" y="30" className="font-body" fontSize="2.5" fill="hsl(48 30% 65%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "بلاد فارس" : "Persia"}
      </text>
      <text x="125" y="22" className="font-body" fontSize="2.5" fill="hsl(48 30% 65%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "العراق" : "Iraq"}
      </text>
      <text x="20" y="25" className="font-body" fontSize="2.5" fill="hsl(48 30% 65%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "مصر" : "Egypt"}
      </text>
      <text x="147" y="44" className="font-body" fontSize="2" fill="hsl(200 40% 65%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "الخليج" : "Gulf"}
      </text>
      <text x="55" y="15" className="font-body" fontSize="2" fill="hsl(200 40% 65%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "البحر المتوسط" : "Mediterranean"}
      </text>

      {/* City markers for major cities outside the peninsula */}
      {[
        { x: 55, y: 14, label: lang === "ar" ? "القدس" : "Jerusalem" },
        { x: 160, y: 25, label: lang === "ar" ? "المدائن" : "Ctesiphon" },
        { x: 20, y: 18, label: lang === "ar" ? "الإسكندرية" : "Alexandria" },
        { x: 40, y: 125, label: lang === "ar" ? "أكسوم" : "Axum" },
      ].map((city) => (
        <g key={city.label}>
          <circle cx={city.x} cy={city.y} r="1" fill="hsl(48 30% 65%)" opacity="0.5" />
          <text x={city.x} y={city.y - 2} textAnchor="middle" fontSize="2" fill="hsl(48 30% 58%)" className="font-body" fontStyle="italic">
            {city.label}
          </text>
        </g>
      ))}

      {/* Active path segments with gold shimmer */}
      {activePath && segments.map((seg, i) => (
        <g key={`seg-${i}`}>
          {/* Gold shimmer glow underneath */}
          <path
            d={seg.d}
            fill="none"
            stroke="url(#goldShimmer)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d={seg.d}
            fill="none"
            stroke={`hsl(${activePath.lineColor})`}
            strokeWidth="0.8"
            strokeDasharray={seg.isSea ? "1.5 1" : "none"}
            strokeLinecap="round"
            className="transition-all duration-700 ease-in-out"
            style={{
              animation: "dash 3s linear infinite",
              opacity: 0.9,
            }}
          />
        </g>
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
                    r="3.5"
                    fill="none"
                    stroke={`hsl(${activePath.lineColor})`}
                    strokeWidth="0.3"
                    opacity="0.6"
                  >
                    <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={step.x}
                  cy={step.y}
                  r="1.5"
                  fill={`hsl(${activePath.lineColor})`}
                  stroke="hsl(60 33% 97%)"
                  strokeWidth="0.3"
                />
                <text
                  x={step.x}
                  y={step.y + 0.5}
                  textAnchor="middle"
                  fontSize="1.2"
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

      {/* Location markers — hidden when a path is active */}
      {!activePath && visibleLocations.map((loc) => {
        const catConfig = categoryMap[loc.primaryCategory];
        const catColor = `hsl(${catConfig.colorHsl})`;
        const isSelected = selectedId === loc.id;
        const iconPath = categoryIconPaths[loc.primaryCategory];
        const locName = lang === "ar" ? loc.name : loc.nameEn;

        return (
          <g
            key={loc.id}
            onClick={() => onLocationClick(loc)}
            className="cursor-pointer map-marker-bounce"
            role="button"
            aria-label={`${t("viewLocation")} ${locName}`}
            style={{ opacity: 1, transition: "opacity 0.3s ease" }}
          >
            <circle cx={loc.x} cy={loc.y} r="3.5" fill="url(#goldGlow)">
              <animate attributeName="r" values="2;4;2" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
            </circle>

            <circle
              cx={loc.x}
              cy={loc.y}
              r="2.2"
              fill={isSelected ? catColor : "hsl(60 33% 97%)"}
              stroke={catColor}
              strokeWidth="0.4"
              className="transition-all duration-200"
            />

            <g transform={`translate(${loc.x - 1.2}, ${loc.y - 1.2}) scale(0.24)`}>
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
              y={loc.y - 4}
              textAnchor="middle"
              fontSize="2.5"
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
