import { mapLocations, hijrahRoute } from "@/data/mapLocations";
import type { MapLocation } from "@/data/mapLocations";

interface ArabianMapSVGProps {
  onLocationClick: (location: MapLocation) => void;
  selectedId: string | null;
  showRoute: boolean;
}

const ArabianMapSVG = ({ onLocationClick, selectedId, showRoute }: ArabianMapSVGProps) => {
  // Build the Hijrah route path
  const routePath = hijrahRoute
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Pulsing animation for dots */}
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(46 56% 52%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(46 56% 52%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Arabian Peninsula outline - simplified stylized shape */}
      <path
        d="M 25 20 
           Q 30 18, 40 20 
           L 55 22 
           Q 62 24, 65 30 
           L 68 38 
           Q 70 42, 68 48 
           L 65 55 
           Q 62 62, 58 68 
           L 52 75 
           Q 48 80, 42 82 
           L 35 80 
           Q 30 78, 28 74 
           L 25 68 
           Q 22 62, 20 55 
           L 18 45 
           Q 17 35, 20 28 
           Z"
        fill="hsl(48 44% 92%)"
        stroke="hsl(48 30% 78%)"
        strokeWidth="0.4"
        className="drop-shadow-sm"
      />

      {/* Red Sea */}
      <path
        d="M 25 20 Q 22 30, 18 45 Q 17 55, 22 65 L 28 74 Q 30 78, 35 80 L 30 82 Q 24 78, 20 70 Q 14 58, 12 45 Q 11 32, 15 22 Z"
        fill="hsl(200 50% 88%)"
        fillOpacity="0.5"
        stroke="hsl(200 40% 75%)"
        strokeWidth="0.3"
      />

      {/* Persian Gulf */}
      <path
        d="M 65 30 Q 70 32, 72 36 L 73 42 Q 72 48, 68 48 L 65 55 Q 68 50, 70 44 Q 72 38, 68 34 Z"
        fill="hsl(200 50% 88%)"
        fillOpacity="0.5"
        stroke="hsl(200 40% 75%)"
        strokeWidth="0.3"
      />

      {/* Region labels */}
      <text x="42" y="40" className="font-body" fontSize="2" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic">
        Najd
      </text>
      <text x="30" y="55" className="font-body" fontSize="2" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic">
        Hejaz
      </text>
      <text x="55" y="70" className="font-body" fontSize="1.8" fill="hsl(48 30% 70%)" textAnchor="middle" fontStyle="italic">
        Yemen
      </text>
      <text x="15" y="40" className="font-body" fontSize="1.5" fill="hsl(200 40% 70%)" textAnchor="middle" fontStyle="italic">
        Red Sea
      </text>

      {/* Africa label for Abyssinia context */}
      <text x="58" y="82" className="font-body" fontSize="1.5" fill="hsl(48 30% 65%)" textAnchor="middle" fontStyle="italic">
        Horn of Africa
      </text>

      {/* Hijrah Route */}
      {showRoute && (
        <>
          <path
            d={routePath}
            fill="none"
            stroke="hsl(46 56% 52%)"
            strokeWidth="0.5"
            strokeDasharray="1.5 1"
            strokeLinecap="round"
            className="animate-[dash_3s_linear_infinite]"
            style={{
              animation: "dash 3s linear infinite",
            }}
          />
          {/* Route label */}
          <text x="31" y="56" fontSize="1.4" fill="hsl(46 56% 45%)" className="font-body" fontWeight="600">
            Hijrah Route
          </text>
        </>
      )}

      {/* Location dots */}
      {mapLocations.map((loc) => (
        <g
          key={loc.id}
          onClick={() => onLocationClick(loc)}
          className="cursor-pointer"
          role="button"
          aria-label={`View ${loc.name}`}
        >
          {/* Pulse ring */}
          <circle cx={loc.x} cy={loc.y} r="2.5" fill="url(#goldGlow)">
            <animate
              attributeName="r"
              values="1.5;3;1.5"
              dur="2.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0.2;0.6"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Core dot */}
          <circle
            cx={loc.x}
            cy={loc.y}
            r="1"
            fill={selectedId === loc.id ? "hsl(46 56% 42%)" : "hsl(46 56% 52%)"}
            stroke="hsl(60 33% 97%)"
            strokeWidth="0.3"
            className="transition-all duration-200"
          />
          {/* Label */}
          <text
            x={loc.x}
            y={loc.y - 2.5}
            textAnchor="middle"
            fontSize="1.8"
            fontWeight="600"
            fill="hsl(160 90% 16%)"
            className="font-body pointer-events-none"
          >
            {loc.name}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default ArabianMapSVG;
