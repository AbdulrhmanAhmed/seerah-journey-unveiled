import { mapLocations, hijrahRoute } from "@/data/mapLocations";
import { categoryMap } from "@/data/eventCategories";
import type { MapLocation } from "@/data/mapLocations";
import type { EventCategory } from "@/data/eventCategories";

interface ArabianMapSVGProps {
  onLocationClick: (location: MapLocation) => void;
  selectedId: string | null;
  showRoute: boolean;
  activeCategories: Set<EventCategory>;
}

const categoryIconPaths: Record<EventCategory, string> = {
  milestone:
    "M5 0.5L6.2 3.5L9.5 3.8L7 6L7.7 9.3L5 7.7L2.3 9.3L3 6L0.5 3.8L3.8 3.5Z",
  battle:
    "M1 9L4.5 5.5M4.5 5.5L3 1L5 3.5L7 1L5.5 5.5M5.5 5.5L9 9M4.5 5.5L5.5 5.5",
  contract:
    "M2.5 0.5H7.5V9.5H2.5ZM4 3H6M4 5H6M4 7H5.5",
  challenge:
    "M5 1.5A3.5 3.5 0 1 0 5 8.5A3.5 3.5 0 1 0 5 1.5M5 3.5V5.5M5 7V7.01",
  marriage:
    "M5 8.5C5 8.5 1 6 1 3.5C1 2 2.3 1 3.5 1C4.2 1 4.8 1.4 5 1.8C5.2 1.4 5.8 1 6.5 1C7.7 1 9 2 9 3.5C9 6 5 8.5 5 8.5Z",
  diplomacy:
    "M1 9L1 4L9 0.5L1 4L1 9L4 6L9 0.5",
};

const ArabianMapSVG = ({
  onLocationClick,
  selectedId,
  showRoute,
  activeCategories,
}: ArabianMapSVGProps) => {
  const routePath = hijrahRoute
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const visibleLocations = mapLocations.filter((loc) =>
    activeCategories.has(loc.primaryCategory)
  );

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(46 56% 52%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(46 56% 52%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d="M 25 20 Q 30 18, 40 20 L 55 22 Q 62 24, 65 30 L 68 38 Q 70 42, 68 48 L 65 55 Q 62 62, 58 68 L 52 75 Q 48 80, 42 82 L 35 80 Q 30 78, 28 74 L 25 68 Q 22 62, 20 55 L 18 45 Q 17 35, 20 28 Z"
        fill="hsl(48 44% 92%)"
        stroke="hsl(48 30% 78%)"
        strokeWidth="0.4"
        className="drop-shadow-sm"
      />

      <path
        d="M 25 20 Q 22 30, 18 45 Q 17 55, 22 65 L 28 74 Q 30 78, 35 80 L 30 82 Q 24 78, 20 70 Q 14 58, 12 45 Q 11 32, 15 22 Z"
        fill="hsl(200 50% 88%)"
        fillOpacity="0.5"
        stroke="hsl(200 40% 75%)"
        strokeWidth="0.3"
      />

      <path
        d="M 65 30 Q 70 32, 72 36 L 73 42 Q 72 48, 68 48 L 65 55 Q 68 50, 70 44 Q 72 38, 68 34 Z"
        fill="hsl(200 50% 88%)"
        fillOpacity="0.5"
        stroke="hsl(200 40% 75%)"
        strokeWidth="0.3"
      />

      <text x="42" y="40" className="font-body" fontSize="2" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic">نجد</text>
      <text x="30" y="55" className="font-body" fontSize="2" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic">الحجاز</text>
      <text x="55" y="70" className="font-body" fontSize="1.8" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic">اليمن</text>
      <text x="15" y="40" className="font-body" fontSize="1.5" fill="hsl(200 40% 70%)" textAnchor="middle" fontStyle="italic">البحر الأحمر</text>
      <text x="58" y="82" className="font-body" fontSize="1.5" fill="hsl(48 30% 65%)" textAnchor="middle" fontStyle="italic">القرن الأفريقي</text>

      {showRoute && (
        <>
          <path
            d={routePath}
            fill="none"
            stroke="hsl(46 56% 52%)"
            strokeWidth="0.5"
            strokeDasharray="1.5 1"
            strokeLinecap="round"
            style={{ animation: "dash 3s linear infinite" }}
          />
          <text x="31" y="56" fontSize="1.4" fill="hsl(46 56% 45%)" className="font-body" fontWeight="600">
            مسار الهجرة
          </text>
        </>
      )}

      {visibleLocations.map((loc) => {
        const catConfig = categoryMap[loc.primaryCategory];
        const catColor = `hsl(${catConfig.colorHsl})`;
        const isSelected = selectedId === loc.id;
        const iconPath = categoryIconPaths[loc.primaryCategory];

        return (
          <g
            key={loc.id}
            onClick={() => onLocationClick(loc)}
            className="cursor-pointer"
            role="button"
            aria-label={`عرض ${loc.name}`}
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

            <g
              transform={`translate(${loc.x - 1}, ${loc.y - 1}) scale(0.2)`}
            >
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
              {loc.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default ArabianMapSVG;