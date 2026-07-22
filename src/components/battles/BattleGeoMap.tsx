import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Movement {
  side?: "muslim" | "enemy" | "neutral";
  path: Array<[number, number]>;
  label?: string;
  label_en?: string;
}

interface Props {
  lat: number;
  lng: number;
  name: string;
  movements?: Movement[];
}

const sideColor: Record<string, string> = {
  muslim: "#065F46",
  enemy: "#991B1B",
  neutral: "#B45309",
};

const BattleGeoMap = ({ lat, lng, name, movements = [] }: Props) => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapDiv.current || mapRef.current) return;
    const map = L.map(mapDiv.current, { center: [lat, lng], zoom: 7, scrollWheelZoom: false });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OSM · CARTO',
      maxZoom: 18,
    }).addTo(map);

    L.marker([lat, lng]).addTo(map).bindPopup(`<b>${name}</b>`);

    const allPoints: L.LatLngExpression[] = [[lat, lng]];

    movements.forEach((m) => {
      if (!m || !Array.isArray(m.path)) return;
      const validPath = m.path.filter(
        (pt): pt is [number, number] =>
          Array.isArray(pt) &&
          pt.length >= 2 &&
          typeof pt[0] === "number" &&
          typeof pt[1] === "number" &&
          Number.isFinite(pt[0]) &&
          Number.isFinite(pt[1])
      );
      if (validPath.length < 2) return;
      const color = sideColor[m.side || "neutral"];
      const line = L.polyline(validPath, {
        color,
        weight: 3,
        opacity: 0.75,
        dashArray: "6 6",
      }).addTo(map);
      validPath.forEach((pt) => allPoints.push(pt));
      const end = validPath[validPath.length - 1];
      L.circleMarker(end, { radius: 5, color, fillColor: color, fillOpacity: 1 }).addTo(map);
      if (m.label) line.bindTooltip(m.label);
    });

    if (allPoints.length > 1) {
      map.fitBounds(L.latLngBounds(allPoints as any).pad(0.3));
    }

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, name, JSON.stringify(movements)]);

  return (
    <div
      ref={mapDiv}
      className="w-full rounded-xl overflow-hidden border border-border"
      style={{ height: 380, zIndex: 0 }}
    />
  );
};

export default BattleGeoMap;
