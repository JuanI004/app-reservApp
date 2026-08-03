"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icono = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MONTEVIDEO = { lat: -34.9011, lng: -56.1645 };

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function SelectorUbicacion({ lat, lng, onSelect }) {
  const hayUbicacion = Boolean(lat && lng);
  const posicion = hayUbicacion ? { lat, lng } : MONTEVIDEO;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-300">
      <MapContainer
        center={posicion}
        zoom={hayUbicacion ? 16 : 12}
        style={{ height: 220, width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ClickHandler onSelect={onSelect} />
        {hayUbicacion && (
          <Marker
            position={posicion}
            icon={icono}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const nueva = e.target.getLatLng();
                onSelect({ lat: nueva.lat, lng: nueva.lng });
              },
            }}
          />
        )}
      </MapContainer>
      <p className="text-xs text-gray-500 px-3 py-2 bg-background">
        {hayUbicacion
          ? "Arrastrá el marcador para ajustar la ubicación exacta."
          : "Clickeá en el mapa para marcar la ubicación de tu negocio."}
      </p>
    </div>
  );
}
