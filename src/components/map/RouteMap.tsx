import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CITY_COORDS } from '@/constants/cityCoords';

// Fix default marker icons broken by webpack/vite asset handling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(positions, { padding: [40, 40] });
    } else if (positions.length === 1) {
      map.setView(positions[0], 10);
    }
  }, [map, positions]);
  return null;
}

interface RouteMapProps {
  origin: string;
  destination: string;
  className?: string;
}

export default function RouteMap({ origin, destination, className = 'h-48' }: RouteMapProps) {
  const fromCoords = CITY_COORDS[origin];
  const toCoords = CITY_COORDS[destination];

  if (!fromCoords || !toCoords) return null;

  const positions: [number, number][] = [fromCoords, toCoords];
  const center: [number, number] = [
    (fromCoords[0] + toCoords[0]) / 2,
    (fromCoords[1] + toCoords[1]) / 2,
  ];

  const distKm = Math.round(
    Math.sqrt(
      Math.pow((fromCoords[0] - toCoords[0]) * 111, 2) +
      Math.pow((fromCoords[1] - toCoords[1]) * 111 * Math.cos((fromCoords[0] * Math.PI) / 180), 2)
    )
  );
  const etaHours = Math.round((distKm / 80) * 10) / 10;

  return (
    <div className="space-y-1">
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom={false}
        className={`${className} rounded-lg z-0`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds positions={positions} />
        <Marker position={fromCoords}>
          <Popup>{origin} (Origin)</Popup>
        </Marker>
        <Marker position={toCoords}>
          <Popup>{destination} (Destination)</Popup>
        </Marker>
        <Polyline positions={positions} pathOptions={{ color: '#2563eb', weight: 3, dashArray: '6 4' }} />
      </MapContainer>
      <p className="text-xs text-muted-foreground">
        ~{distKm} km · estimated {etaHours}h drive
      </p>
    </div>
  );
}
