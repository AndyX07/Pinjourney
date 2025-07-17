import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import React from 'react';
import styles from './Map.module.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

type Location = {
    latitude: number;
    longitude: number;
    name: string;
}

type MapProps = {
    locations: Location[];
    zoom: number;
}

const Map: React.FC<MapProps> = ({ locations, zoom }) => {
    const center: [number, number] = locations.length > 0 ? [locations[0].latitude, locations[0].longitude] : [0, 0];
    return (
        <MapContainer center={center} zoom={zoom} className={styles.map} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location, idx) => (
                <Marker position={[location.latitude, location.longitude]} key={idx}>
                    <Popup>
                        {location.name}
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    )
}

export default Map;