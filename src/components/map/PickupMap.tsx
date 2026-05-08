import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CITY_COORDS } from '@/constants/cityCoords';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface ClickHandlerProps {
  onPick: (lat: number, lng: number) => void;
}

function ClickHandler({ onPick }: ClickHandlerProps) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface PickupMapProps {
  city: string;
  onPickup: (coords: { lat: number; lng: number; label: string }) => void;
  className?: string;
}

export default function PickupMap({ city, onPickup, className = 'h-52' }: PickupMapProps) {
  const center: [number, number] = CITY_COORDS[city] ?? [30.3753, 69.3451];
  const [picked, setPicked] = useState<[number, number] | null>(null);

  const handlePick = (lat: number, lng: number) => {
    const pos: [number, number] = [lat, lng];
    setPicked(pos);
    onPickup({
      lat,
      lng,
      label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    });
  };

  // Reset when city changes
  useEffect(() => { setPicked(null); }, [city]);

  return (
    <div className="space-y-1">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className={`${className} rounded-lg z-0 cursor-crosshair`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={handlePick} />
        {picked && <Marker position={picked} icon={redIcon} />}
      </MapContainer>
      <p className="text-xs text-muted-foreground">
        {picked
          ? `Pin set at ${picked[0].toFixed(4)}, ${picked[1].toFixed(4)} — or describe your pickup below`
          : 'Tap the map to pin your exact pickup location'}
      </p>
    </div>
  );
}
