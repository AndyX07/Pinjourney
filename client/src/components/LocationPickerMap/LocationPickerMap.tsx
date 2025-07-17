import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  selectedLocation: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const RecenterMap = ({ selectedLocation }: { selectedLocation: { lat: number; lng: number } }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedLocation) {
      map.setView(selectedLocation, map.getZoom(), { animate: true });
    }
  }, [selectedLocation.lat, selectedLocation.lng]);

  return null;
}

const LocationPickerMap: React.FC<Props> = ({ selectedLocation, onLocationSelect }) => {
  const center = selectedLocation || { lat: 0, lng: 0 };

  return (
    <MapContainer
      center={center}
      zoom={selectedLocation ? 13 : 2}
      style={{ height: "300px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onLocationSelect={onLocationSelect} />
      {selectedLocation && <Marker position={selectedLocation} icon={markerIcon} />}
      {selectedLocation && <RecenterMap selectedLocation={selectedLocation} />}
    </MapContainer>
  );
};

export default LocationPickerMap;