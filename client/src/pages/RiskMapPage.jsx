import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getPredictionHistory } from '../services/api';

export default function RiskMapPage() {
  const { location } = useApp();
  const [predictions, setPredictions] = useState([]);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [L, setL] = useState(null);

  useEffect(() => {
    getPredictionHistory(30).then(setPredictions).catch(console.error);
  }, []);

  useEffect(() => {
    async function loadMap() {
      try {
        const leaflet = await import('leaflet');
        setL(leaflet.default || leaflet);
        setMapLoaded(true);
      } catch (e) { console.error('Leaflet load error:', e); }
    }
    loadMap();
  }, []);

  useEffect(() => {
    if (!mapLoaded || !L || !mapRef.current) return;
    if (mapRef.current._leaflet_id) return;

    const map = L.map(mapRef.current).setView([location.lat, location.lng], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Add markers for predictions
    const riskMarkers = predictions.filter(p => p.lat && p.lng);
    
    // Add sample risk markers around the user's location
    const samplePoints = [
      { lat: location.lat + 0.5, lng: location.lng + 0.3, risk: 'High', crop: 'Rice' },
      { lat: location.lat - 0.3, lng: location.lng + 0.5, risk: 'Medium', crop: 'Wheat' },
      { lat: location.lat + 0.2, lng: location.lng - 0.4, risk: 'Low', crop: 'Cotton' },
      { lat: location.lat - 0.5, lng: location.lng - 0.2, risk: 'High', crop: 'Tomato' },
      { lat: location.lat + 0.4, lng: location.lng - 0.6, risk: 'Medium', crop: 'Soybean' },
      { lat: location.lat - 0.1, lng: location.lng + 0.7, risk: 'Low', crop: 'Maize' },
      { lat: location.lat + 0.6, lng: location.lng - 0.1, risk: 'Medium', crop: 'Potato' },
      { lat: location.lat - 0.4, lng: location.lng - 0.5, risk: 'High', crop: 'Sugarcane' },
    ];

    const allPoints = [...riskMarkers.map(p => ({
      lat: p.lat, lng: p.lng,
      risk: p.pestScore > p.diseaseScore ? p.pestRisk : p.diseaseRisk,
      crop: p.cropType
    })), ...samplePoints];

    allPoints.forEach(point => {
      const color = point.risk === 'High' ? '#ef4444' : point.risk === 'Medium' ? '#f59e0b' : '#10b981';
      const circle = L.circleMarker([point.lat, point.lng], {
        radius: point.risk === 'High' ? 18 : point.risk === 'Medium' ? 14 : 10,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.35
      }).addTo(map);
      circle.bindPopup(`<strong>${point.crop}</strong><br/>Risk: <span style="color:${color};font-weight:bold">${point.risk}</span>`);
    });

    // User location marker
    L.marker([location.lat, location.lng]).addTo(map)
      .bindPopup(`📍 Your location: ${location.name}`).openPopup();

    return () => { map.remove(); };
  }, [mapLoaded, L, location, predictions]);

  return (
    <div className="pt-20 pb-12 max-w-7xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">🗺 Live Risk Map</h1>
        <p className="text-slate-400 mb-6">Interactive heatmap showing pest & disease risk levels in your region</p>
      </motion.div>

      {/* Legend */}
      <div className="glass-card p-4 mb-6 flex flex-wrap gap-6 items-center">
        <span className="text-sm text-slate-400">Risk Levels:</span>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500 opacity-70"></div><span className="text-sm text-slate-300">High</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-amber-500 opacity-70"></div><span className="text-sm text-slate-300">Medium</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500 opacity-70"></div><span className="text-sm text-slate-300">Low</span></div>
        <div className="flex items-center gap-2"><span className="text-xl">📍</span><span className="text-sm text-slate-300">Your Location</span></div>
      </div>

      {/* Map */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card overflow-hidden">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <div ref={mapRef} style={{ height: '550px', width: '100%', borderRadius: '16px' }}></div>
      </motion.div>
    </div>
  );
}
