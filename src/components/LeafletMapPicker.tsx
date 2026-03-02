import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapPickerProps {
  lat: number;
  lng: number;
  onPick: (lat: number, lng: number) => void;
  height?: string;
}

const LeafletMapPicker = ({ lat, lng, onPick, height = "300px" }: LeafletMapPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 6,
      maxBounds: [[-5, 25], [40, 60]],
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 18,
    }).addTo(map);

    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onPick(Math.round(pos.lat * 10000) / 10000, Math.round(pos.lng * 10000) / 10000);
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onPick(Math.round(e.latlng.lat * 10000) / 10000, Math.round(e.latlng.lng * 10000) / 10000);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update marker when lat/lng props change externally
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
    }
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: "100%", borderRadius: "0.5rem", zIndex: 0 }}
      className="border border-border"
    />
  );
};

export default LeafletMapPicker;
