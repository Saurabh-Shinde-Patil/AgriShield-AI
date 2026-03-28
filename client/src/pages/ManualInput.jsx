import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { submitPrediction, submitEnvironmentalData } from '../services/api';

const cropTypes = [
  { value: 'rice', label: '🌾 Rice', icon: '🌾' },
  { value: 'wheat', label: '🌿 Wheat', icon: '🌿' },
  { value: 'cotton', label: '🌿 Cotton', icon: '🌿' },
  { value: 'tomato', label: '🍅 Tomato', icon: '🍅' },
  { value: 'potato', label: '🥔 Potato', icon: '🥔' },
  { value: 'sugarcane', label: '🌿 Sugarcane', icon: '🌿' },
  { value: 'maize', label: '🌽 Maize', icon: '🌽' },
  { value: 'soybean', label: '🫘 Soybean', icon: '🫘' },
];

export default function ManualInput() {
  const { location, setLatestPrediction, setLatestAdvisory } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    temperature: '', humidity: '', soilMoisture: '', rainfall: '', windSpeed: '', cropType: 'rice'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!formData.temperature || formData.temperature < -10 || formData.temperature > 55) e.temperature = 'Enter valid temperature (-10 to 55°C)';
    if (!formData.humidity || formData.humidity < 0 || formData.humidity > 100) e.humidity = 'Enter valid humidity (0-100%)';
    if (!formData.soilMoisture || formData.soilMoisture < 0 || formData.soilMoisture > 100) e.soilMoisture = 'Enter valid soil moisture (0-100%)';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await submitEnvironmentalData({
        ...formData, lat: location.lat, lng: location.lng, locationName: location.name
      });
      const prediction = await submitPrediction({
        ...formData, lat: location.lat, lng: location.lng,
        locationName: location.name, locationState: location.state
      });
      setLatestPrediction(prediction);
      navigate('/prediction');
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  const handleChange = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

  return (
    <div className="pt-20 pb-12 max-w-4xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">📥 Manual Data Input</h1>
        <p className="text-slate-400 mb-8">Enter sensor readings or field observations for pest prediction</p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        {/* Location Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">📍 Location</h2>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
            <span className="text-xl">📍</span>
            <div>
              <div className="text-white font-medium">{location.name}, {location.state}</div>
              <div className="text-xs text-slate-500">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</div>
            </div>
          </div>
        </motion.div>

        {/* Crop Type */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">🌾 Crop Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cropTypes.map(crop => (
              <button key={crop.value} type="button" onClick={() => handleChange('cropType', crop.value)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  formData.cropType === crop.value
                    ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                    : 'bg-slate-800/50 border-slate-600 text-slate-400 hover:border-slate-500'
                }`}>
                {crop.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sensor Data */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4">📊 Environmental Data</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { field: 'temperature', label: '🌡 Temperature (°C)', placeholder: 'e.g. 28', min: -10, max: 55 },
              { field: 'humidity', label: '💧 Humidity (%)', placeholder: 'e.g. 75', min: 0, max: 100 },
              { field: 'soilMoisture', label: '🌱 Soil Moisture (%)', placeholder: 'e.g. 55', min: 0, max: 100 },
              { field: 'rainfall', label: '🌧 Rainfall (mm)', placeholder: 'e.g. 5', min: 0, max: 500 },
              { field: 'windSpeed', label: '💨 Wind Speed (m/s)', placeholder: 'e.g. 8', min: 0, max: 50 },
            ].map(({ field, label, placeholder, min, max }) => (
              <div key={field}>
                <label className="block text-sm text-slate-400 mb-2">{label}</label>
                <input
                  type="number" value={formData[field]} onChange={e => handleChange(field, e.target.value)}
                  placeholder={placeholder} min={min} max={max} step="0.1"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <button type="submit" disabled={loading}
            className="w-full btn-glow py-4 rounded-xl text-white font-semibold text-lg border-none cursor-pointer disabled:opacity-50">
            {loading ? '⏳ Analyzing...' : '🎯 Generate Prediction'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
