import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';
import { maskPhoneNumber } from '../../utils/distanceCalculator';

// Fix Leaflet's default icon path issue with Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Red Hospital Pin
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom Blue Donor Pin
const donorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36],
  popupAnchor: [1, -30],
  shadowSize: [36, 36]
});

// Location Click Handler
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

export const BloodMap = ({
  centerLat = 28.6139,
  centerLon = 77.2090,
  centerTitle = 'Selected Location',
  radiusKm = 25,
  markers = [],
  onLocationSelect = null,
  height = '360px',
  interactive = true
}) => {
  const [mapCenter, setMapCenter] = useState([centerLat, centerLon]);

  useEffect(() => {
    if (centerLat != null && centerLon != null) {
      setMapCenter([centerLat, centerLon]);
    }
  }, [centerLat, centerLon]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm z-0">
      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {onLocationSelect && <MapClickHandler onLocationSelect={onLocationSelect} />}

        {/* Center / Hospital Pin */}
        <Marker position={mapCenter} icon={hospitalIcon}>
          <Popup>
            <div className="p-1">
              <p className="font-extrabold text-sm text-blood-900">{centerTitle}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {centerLat.toFixed(4)}, {centerLon.toFixed(4)}
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${centerLat},${centerLon}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-blood-700 font-bold mt-2 hover:underline"
              >
                <Navigation className="w-3 h-3" />
                <span>Get Directions</span>
              </a>
            </div>
          </Popup>
        </Marker>

        {/* Search / Matching Radius Circle */}
        {radiusKm && (
          <Circle
            center={mapCenter}
            radius={radiusKm * 1000}
            pathOptions={{
              color: '#841725',
              fillColor: '#841725',
              fillOpacity: 0.08,
              weight: 1.5,
              dashArray: '4, 4'
            }}
          />
        )}

        {/* Nearby Donors or Blood Banks Markers */}
        {markers.map((m, idx) => {
          if (!m.latitude || !m.longitude) return null;
          return (
            <Marker
              key={m.id || idx}
              position={[m.latitude, m.longitude]}
              icon={donorIcon}
            >
              <Popup>
                <div className="p-1 space-y-1">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-xs text-slate-900">{m.name || 'Verified Donor'}</span>
                    {m.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <span className="font-bold text-blood-800">{m.bloodGroup}</span> • {m.city}
                  </div>
                  {m.phone && (
                    <div className="text-[10px] text-slate-500 font-mono">
                      {maskPhoneNumber(m.phone)}
                    </div>
                  )}
                  {m.distanceKm != null && (
                    <div className="text-[11px] font-semibold text-emerald-700">
                      {m.distanceKm} km from center
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Approximate Location Notice */}
      <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] text-slate-600 z-[400] shadow-xs">
        📍 OpenStreetMap • Donor locations generalized for patient & donor privacy
      </div>
    </div>
  );
};
