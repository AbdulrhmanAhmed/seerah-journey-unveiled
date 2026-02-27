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
      requestAnimationFrame(() => setAnimatedLength(len));
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
        {/* Parchment texture */}
        <filter id="parchmentNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
        </filter>

        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(46 56% 52%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(46 56% 52%)" stopOpacity="0" />
        </radialGradient>

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

        {/* Water gradient */}
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(200 45% 82%)" />
          <stop offset="100%" stopColor="hsl(200 50% 75%)" />
        </linearGradient>

        {/* Land gradient */}
        <linearGradient id="landGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(42 35% 88%)" />
          <stop offset="100%" stopColor="hsl(42 35% 82%)" />
        </linearGradient>

        {/* Desert gradient */}
        <linearGradient id="desertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(40 40% 86%)" />
          <stop offset="50%" stopColor="hsl(38 35% 83%)" />
          <stop offset="100%" stopColor="hsl(42 30% 80%)" />
        </linearGradient>

        {/* Fertile land */}
        <linearGradient id="fertileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(90 20% 82%)" />
          <stop offset="100%" stopColor="hsl(100 20% 78%)" />
        </linearGradient>
      </defs>

      {/* Parchment background */}
      <rect x="0" y="0" width="200" height="150" fill="hsl(42 40% 90%)" filter="url(#parchmentNoise)" />

      {/* Gold decorative border */}
      <rect x="1" y="1" width="198" height="148" fill="none" stroke="hsl(46 56% 52%)" strokeWidth="0.6" opacity="0.35" rx="2" />
      <rect x="3" y="3" width="194" height="144" fill="none" stroke="hsl(46 56% 52%)" strokeWidth="0.25" opacity="0.2" rx="1.5" strokeDasharray="4 2" />

      {/* ===== WATER BODIES ===== */}
      
      {/* Mediterranean Sea */}
      <path
        d="M 0 0 L 200 0 L 200 18 Q 170 22, 145 20 Q 120 18, 100 20 Q 80 22, 65 18 Q 55 14, 48 16 Q 38 18, 30 14 Q 20 10, 10 12 Q 5 14, 0 12 Z"
        fill="url(#waterGrad)" fillOpacity="0.5" stroke="hsl(200 35% 70%)" strokeWidth="0.3"
      />

      {/* Red Sea - geographically accurate shape */}
      <path
        d="M 33 42 Q 35 45, 38 50 Q 42 55, 48 60 Q 55 67, 60 72 
           Q 65 78, 70 85 Q 73 90, 76 95 Q 78 100, 78 105 
           Q 76 110, 72 115 Q 68 118, 62 120 
           L 58 118 Q 62 115, 66 110 Q 70 105, 70 100 
           Q 68 95, 65 90 Q 60 83, 55 77 Q 50 72, 45 66 
           Q 40 60, 36 55 Q 32 50, 30 45 Q 29 42, 30 40 Z"
        fill="url(#waterGrad)" fillOpacity="0.45" stroke="hsl(200 35% 68%)" strokeWidth="0.3"
      />

      {/* Gulf of Suez */}
      <path
        d="M 30 40 Q 28 38, 26 34 Q 24 30, 25 26 L 28 28 Q 29 32, 30 36 Z"
        fill="url(#waterGrad)" fillOpacity="0.4" stroke="hsl(200 35% 68%)" strokeWidth="0.2"
      />

      {/* Gulf of Aqaba */}
      <path
        d="M 33 42 Q 36 38, 40 34 Q 42 32, 44 30 L 46 32 Q 44 34, 41 37 Q 38 40, 35 43 Z"
        fill="url(#waterGrad)" fillOpacity="0.4" stroke="hsl(200 35% 68%)" strokeWidth="0.2"
      />

      {/* Persian Gulf */}
      <path
        d="M 130 45 Q 135 42, 142 40 Q 150 38, 158 40 Q 165 42, 170 48 
           Q 172 52, 168 56 Q 162 60, 155 62 Q 148 63, 142 60 
           Q 138 58, 135 54 Q 132 50, 130 45 Z"
        fill="url(#waterGrad)" fillOpacity="0.45" stroke="hsl(200 35% 68%)" strokeWidth="0.3"
      />

      {/* Gulf of Oman */}
      <path
        d="M 170 48 Q 178 46, 185 48 Q 192 52, 200 55 L 200 62 Q 190 58, 180 55 Q 172 52, 170 48 Z"
        fill="url(#waterGrad)" fillOpacity="0.4" stroke="hsl(200 35% 68%)" strokeWidth="0.2"
      />

      {/* Gulf of Aden */}
      <path
        d="M 62 120 Q 75 125, 90 128 Q 110 130, 130 128 Q 150 126, 170 125 
           L 200 122 L 200 135 Q 170 132, 140 135 Q 110 138, 85 136 
           Q 65 134, 50 132 Q 42 130, 40 128 Q 45 126, 55 122 Z"
        fill="url(#waterGrad)" fillOpacity="0.4" stroke="hsl(200 35% 68%)" strokeWidth="0.3"
      />

      {/* Arabian Sea / Indian Ocean bottom */}
      <path
        d="M 170 125 L 200 122 L 200 150 L 0 150 L 0 140 Q 15 138, 30 135 Q 42 132, 50 132 Q 65 134, 85 136 Q 110 138, 140 135 Q 170 132, 200 135 L 200 150"
        fill="url(#waterGrad)" fillOpacity="0.3"
      />

      {/* ===== LANDMASSES ===== */}

      {/* Egypt & Sinai */}
      <path
        d="M 0 12 Q 5 14, 10 12 Q 15 10, 22 14 Q 26 18, 28 24 L 26 30 Q 24 34, 25 38 
           L 30 42 Q 28 45, 25 48 Q 18 55, 12 58 Q 5 60, 0 58 Z"
        fill="url(#landGrad)" stroke="hsl(42 30% 72%)" strokeWidth="0.3"
      />
      {/* Nile river hint */}
      <path d="M 18 14 Q 16 22, 14 30 Q 12 38, 10 46 Q 8 52, 6 56" fill="none" stroke="hsl(200 40% 72%)" strokeWidth="0.4" opacity="0.5" />

      {/* Sinai Peninsula */}
      <path
        d="M 25 26 L 30 40 L 33 42 Q 36 38, 44 30 L 40 24 Q 35 22, 30 24 Z"
        fill="hsl(40 35% 84%)" stroke="hsl(42 30% 72%)" strokeWidth="0.2"
      />

      {/* Levant (Syria, Palestine, Jordan) */}
      <path
        d="M 44 14 Q 50 12, 58 14 Q 65 16, 72 14 Q 78 12, 85 14 
           L 90 18 Q 92 22, 90 28 Q 86 34, 80 38 Q 72 40, 65 38 
           Q 58 36, 52 34 Q 48 30, 44 26 Q 42 20, 44 14 Z"
        fill="url(#fertileGrad)" stroke="hsl(90 15% 68%)" strokeWidth="0.3"
      />

      {/* Mesopotamia / Iraq */}
      <path
        d="M 85 14 Q 95 12, 108 14 L 120 18 Q 128 24, 130 32 
           Q 130 38, 128 42 L 130 45 Q 128 48, 122 48 
           Q 115 46, 108 42 Q 100 38, 95 34 Q 90 28, 90 22 Q 88 18, 85 14 Z"
        fill="url(#fertileGrad)" stroke="hsl(90 15% 68%)" strokeWidth="0.3"
      />
      {/* Tigris & Euphrates hint */}
      <path d="M 100 16 Q 105 24, 110 32 Q 115 38, 120 44" fill="none" stroke="hsl(200 40% 72%)" strokeWidth="0.3" opacity="0.4" />
      <path d="M 95 18 Q 100 26, 108 34 Q 115 40, 125 46" fill="none" stroke="hsl(200 40% 72%)" strokeWidth="0.3" opacity="0.4" />

      {/* Persia / Iran */}
      <path
        d="M 120 14 Q 140 10, 165 12 Q 185 16, 200 14 L 200 55 
           Q 190 52, 180 50 Q 170 48, 165 42 Q 158 38, 148 38 
           Q 140 38, 135 42 Q 130 38, 128 32 Q 128 24, 125 18 Z"
        fill="hsl(38 28% 84%)" stroke="hsl(42 25% 70%)" strokeWidth="0.3"
      />

      {/* Arabian Peninsula - main body */}
      <path
        d="M 52 34 Q 58 36, 65 38 Q 72 40, 80 38 Q 90 34, 95 34 
           Q 108 42, 122 48 Q 128 50, 135 54 Q 142 60, 148 63 
           Q 155 66, 160 72 Q 165 80, 168 88 Q 170 96, 168 105 
           Q 165 112, 158 118 Q 148 124, 135 128 Q 120 130, 105 130 
           Q 90 128, 80 125 Q 72 122, 68 118 Q 62 120, 58 118 
           Q 55 114, 60 108 Q 65 100, 70 95 Q 73 90, 76 85 
           Q 70 82, 65 77 Q 58 70, 52 64 Q 46 58, 44 52 
           Q 42 46, 44 40 Q 46 36, 52 34 Z"
        fill="url(#desertGrad)" stroke="hsl(42 30% 70%)" strokeWidth="0.4"
      />

      {/* Hejaz mountains hint */}
      <path d="M 70 65 Q 75 60, 78 68 Q 82 62, 85 70 Q 88 64, 90 72" fill="none" stroke="hsl(30 25% 72%)" strokeWidth="0.5" opacity="0.3" />
      <path d="M 75 75 Q 78 70, 82 78 Q 85 72, 88 80" fill="none" stroke="hsl(30 25% 72%)" strokeWidth="0.4" opacity="0.25" />

      {/* Rub al-Khali (Empty Quarter) desert pattern */}
      <path d="M 110 85 Q 120 82, 130 85 Q 140 88, 145 92" fill="none" stroke="hsl(38 30% 75%)" strokeWidth="0.3" opacity="0.3" strokeDasharray="2 3" />
      <path d="M 105 92 Q 115 89, 125 92 Q 135 95, 140 98" fill="none" stroke="hsl(38 30% 75%)" strokeWidth="0.3" opacity="0.25" strokeDasharray="2 3" />

      {/* Horn of Africa / East Africa */}
      <path
        d="M 0 58 Q 5 60, 12 58 Q 18 55, 25 52 Q 30 55, 35 60 
           Q 42 68, 50 78 Q 55 85, 58 92 Q 60 98, 58 105 
           Q 55 112, 50 118 Q 45 124, 40 128 Q 35 132, 30 135 
           Q 20 138, 10 140 Q 5 140, 0 140 Z"
        fill="url(#fertileGrad)" stroke="hsl(90 15% 68%)" strokeWidth="0.3"
      />

      {/* Horn tip (Somalia) */}
      <path
        d="M 68 118 Q 72 122, 80 125 Q 90 128, 105 130 
           Q 120 130, 130 128 L 135 128 Q 148 124, 155 120 
           Q 160 118, 165 115 L 170 125 Q 160 128, 148 130 
           Q 130 134, 110 136 Q 90 136, 75 134 
           Q 60 132, 50 128 Q 45 126, 42 124 
           Q 48 122, 55 120 Q 60 120, 68 118 Z"
        fill="hsl(95 18% 80%)" stroke="hsl(90 15% 68%)" strokeWidth="0.3"
      />

      {/* Animated clouds */}
      <g opacity="0.06">
        <ellipse cx="50" cy="30" rx="15" ry="3" fill="hsl(0 0% 100%)">
          <animateTransform attributeName="transform" type="translate" values="0,0;25,1;0,0" dur="70s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="140" cy="50" rx="18" ry="4" fill="hsl(0 0% 100%)">
          <animateTransform attributeName="transform" type="translate" values="0,0;-20,1;0,0" dur="90s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="90" cy="80" rx="12" ry="3" fill="hsl(0 0% 100%)">
          <animateTransform attributeName="transform" type="translate" values="0,0;15,-1;0,0" dur="55s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* ===== REGION LABELS ===== */}
      <text x="15" y="25" className="font-body" fontSize="3" fill="hsl(42 25% 62%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "مصر" : "Egypt"}
      </text>
      <text x="60" y="25" className="font-body" fontSize="3" fill="hsl(90 15% 55%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "بلاد الشام" : "Levant"}
      </text>
      <text x="110" y="28" className="font-body" fontSize="3" fill="hsl(90 15% 55%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "العراق" : "Iraq"}
      </text>
      <text x="165" y="28" className="font-body" fontSize="3" fill="hsl(42 25% 62%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "بلاد فارس" : "Persia"}
      </text>
      <text x="50" y="68" className="font-body" fontSize="2.5" fill="hsl(200 35% 60%)" textAnchor="middle" fontStyle="italic" writingMode="tb">
        {t("regionRedSea")}
      </text>
      <text x="85" y="62" className="font-body" fontSize="3.5" fill="hsl(42 25% 62%)" textAnchor="middle" fontStyle="italic">
        {t("regionHijaz")}
      </text>
      <text x="115" y="70" className="font-body" fontSize="3.5" fill="hsl(42 25% 62%)" textAnchor="middle" fontStyle="italic">
        {t("regionNajd")}
      </text>
      <text x="130" y="105" className="font-body" fontSize="3" fill="hsl(42 25% 62%)" textAnchor="middle" fontStyle="italic">
        {t("regionYemen")}
      </text>
      <text x="148" y="52" className="font-body" fontSize="2.5" fill="hsl(200 35% 60%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "الخليج العربي" : "Persian Gulf"}
      </text>
      <text x="30" y="128" className="font-body" fontSize="2.5" fill="hsl(90 15% 52%)" textAnchor="middle" fontStyle="italic">
        {t("regionHornOfAfrica")}
      </text>
      <text x="45" y="10" className="font-body" fontSize="2" fill="hsl(200 35% 60%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "البحر المتوسط" : "Mediterranean"}
      </text>
      <text x="120" y="135" className="font-body" fontSize="2.5" fill="hsl(200 35% 60%)" textAnchor="middle" fontStyle="italic">
        {lang === "ar" ? "خليج عدن" : "Gulf of Aden"}
      </text>

      {/* Reference cities outside peninsula */}
      {[
        { x: 53.4, y: 30, label: lang === "ar" ? "القدس" : "Jerusalem", show: !mapLocations.find(l => l.id === "jerusalem") },
        { x: 108, y: 22, label: lang === "ar" ? "بغداد" : "Baghdad", show: true },
        { x: 155, y: 30, label: lang === "ar" ? "المدائن" : "Ctesiphon", show: true },
        { x: 12, y: 18, label: lang === "ar" ? "الإسكندرية" : "Alexandria", show: true },
        { x: 35, y: 124, label: lang === "ar" ? "أكسوم" : "Axum", show: true },
      ].filter(c => c.show).map((city) => (
        <g key={city.label}>
          <circle cx={city.x} cy={city.y} r="0.8" fill="hsl(42 25% 62%)" opacity="0.6" />
          <text x={city.x} y={city.y - 2} textAnchor="middle" fontSize="2" fill="hsl(42 25% 55%)" className="font-body" fontStyle="italic">
            {city.label}
          </text>
        </g>
      ))}

      {/* ===== ACTIVE PATH ===== */}
      {activePath && segments.map((seg, i) => (
        <g key={`seg-${i}`}>
          <path d={seg.d} fill="none" stroke="url(#goldShimmer)" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
          <path
            d={seg.d}
            fill="none"
            stroke={`hsl(${activePath.lineColor})`}
            strokeWidth="1"
            strokeDasharray={seg.isSea ? "2 1.5" : "none"}
            strokeLinecap="round"
            className="transition-all duration-700 ease-in-out"
            style={{ animation: "dash 3s linear infinite", opacity: 0.9 }}
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
                  <circle cx={step.x} cy={step.y} r="4" fill="none" stroke={`hsl(${activePath.lineColor})`} strokeWidth="0.3" opacity="0.6">
                    <animate attributeName="r" values="2.5;5;2.5" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={step.x} cy={step.y} r="1.8" fill={`hsl(${activePath.lineColor})`} stroke="hsl(60 33% 97%)" strokeWidth="0.3" />
                <text x={step.x} y={step.y + 0.6} textAnchor="middle" fontSize="1.4" fill="hsl(60 33% 97%)" fontWeight="700" className="font-body pointer-events-none">
                  {step.order}
                </text>
              </g>
            );
          }
        )}

      {/* ===== LOCATION MARKERS ===== */}
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
            <circle cx={loc.x} cy={loc.y} r="4" fill="url(#goldGlow)">
              <animate attributeName="r" values="2.5;5;2.5" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
            </circle>

            <circle
              cx={loc.x}
              cy={loc.y}
              r="2.5"
              fill={isSelected ? catColor : "hsl(60 33% 97%)"}
              stroke={catColor}
              strokeWidth="0.4"
              className="transition-all duration-200"
            />

            <g transform={`translate(${loc.x - 1.5}, ${loc.y - 1.5}) scale(0.3)`}>
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
              y={loc.y - 5}
              textAnchor="middle"
              fontSize="2.8"
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
