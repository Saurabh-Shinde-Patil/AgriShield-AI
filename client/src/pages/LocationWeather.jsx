import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useApp } from '../context/AppContext';
import { getWeather, reverseGeocode, searchLocations } from '../services/api';

export default function LocationWeather() {
  const { location, setLocation, weather, setWeather } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('current');

  useEffect(() => {
    fetchWeather();
  }, [location.lat, location.lng]);

  async function fetchWeather() {
    setLoading(true);
    try {
      const w = await getWeather(location.lat, location.lng);
      setWeather(w);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    try {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
    } catch (e) { console.error(e); }
  }

  function selectLocation(loc) {
    setLocation({ lat: loc.lat, lng: loc.lng, name: loc.name, state: loc.state });
    setSearchResults([]);
    setSearchQuery('');
  }

  function detectLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locData = await reverseGeocode(latitude, longitude);
          setLocation({ lat: latitude, lng: longitude, name: locData.name, state: locData.state });
        } catch { setLocation(prev => ({ ...prev, lat: latitude, lng: longitude })); }
      });
    }
  }

  const forecastData = weather?.forecast?.map(d => ({
    day: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
    tempMax: Math.round(d.tempMax),
    tempMin: Math.round(d.tempMin),
    humidity: d.humidity,
    rainfall: d.rainfall,
    windSpeed: d.windSpeed
  })) || [];

  return (
    <div className="pt-20 pb-12 max-w-7xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">🌦 Location & Weather</h1>
        <p className="text-slate-400 mb-8">Real-time weather intelligence for your farm</p>
      </motion.div>

      {/* Location Controls */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search village, district, or state..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl overflow-hidden z-10">
                {searchResults.map((r, i) => (
                  <button key={i} onClick={() => selectLocation(r)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors text-white bg-transparent border-none cursor-pointer">
                    📍 {r.name}, {r.state}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleSearch} className="btn-glow px-6 py-3 rounded-xl text-white font-medium border-none cursor-pointer">
            🔍 Search
          </button>
          <button onClick={detectLocation} className="px-6 py-3 rounded-xl border border-primary-500 text-primary-400 font-medium hover:bg-primary-500/10 transition-all bg-transparent cursor-pointer">
            📍 Auto-Detect
          </button>
        </div>
        <div className="mt-3 text-sm text-slate-400">
          Current: <span className="text-white font-medium">{location.name}, {location.state}</span> ({location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°)
        </div>
      </div>

      {/* Current Weather */}
      {weather?.current && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6">
          <h2 className="font-display text-xl font-semibold text-white mb-4">Current Conditions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: '🌡', label: 'Temperature', value: `${weather.current.temp}°C`, sub: `Feels like ${weather.current.feelsLike}°C` },
              { icon: '💧', label: 'Humidity', value: `${weather.current.humidity}%`, sub: weather.current.humidity > 80 ? '⚠️ Very High' : 'Normal' },
              { icon: '🌧', label: 'Rainfall', value: `${weather.current.rainfall} mm`, sub: 'Last hour' },
              { icon: '💨', label: 'Wind', value: `${weather.current.windSpeed} m/s`, sub: weather.current.windSpeed > 10 ? '⚠️ High' : 'Calm' },
              { icon: '🔭', label: 'Pressure', value: `${weather.current.pressure} hPa`, sub: 'Atmospheric' },
              { icon: '☁️', label: 'Conditions', value: weather.current.description, sub: `Visibility: ${(weather.current.visibility / 1000).toFixed(1)} km` }
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/50">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                <div className="text-lg font-bold text-white capitalize">{item.value}</div>
                <div className="text-xs text-slate-500 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['current', 'temperature', 'humidity', 'rainfall'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border-none cursor-pointer transition-all capitalize ${
              tab === t ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Charts */}
      {forecastData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="font-display text-xl font-semibold text-white mb-4">
            {tab === 'current' ? '📊 Forecast Overview' : tab === 'temperature' ? '🌡 Temperature Trend' : tab === 'humidity' ? '💧 Humidity Trend' : '🌧 Rainfall Forecast'}
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            {tab === 'rainfall' ? (
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="rainfall" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                {(tab === 'current' || tab === 'temperature') && (
                  <>
                    <Line type="monotone" dataKey="tempMax" stroke="#f87171" strokeWidth={2} dot={{ fill: '#f87171' }} name="Max Temp" />
                    <Line type="monotone" dataKey="tempMin" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa' }} name="Min Temp" />
                  </>
                )}
                {(tab === 'current' || tab === 'humidity') && (
                  <Line type="monotone" dataKey="humidity" stroke="#34d399" strokeWidth={2} dot={{ fill: '#34d399' }} name="Humidity" />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
