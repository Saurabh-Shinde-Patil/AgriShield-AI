import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getWeather, getAlerts, getPredictionHistory } from '../services/api';

export default function Dashboard() {
  const { location, weather, setWeather, alerts, setAlerts } = useApp();
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [w, a, h] = await Promise.all([
          getWeather(location.lat, location.lng),
          getAlerts(location.lat, location.lng),
          getPredictionHistory(5)
        ]);
        setWeather(w);
        setAlerts(a);
        setRecentPredictions(h);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    loadData();
  }, [location.lat, location.lng]);

  const riskColor = (level) => level === 'High' ? 'text-red-400' : level === 'Medium' ? 'text-amber-400' : 'text-emerald-400';
  const riskBg = (level) => level === 'High' ? 'risk-bg-high' : level === 'Medium' ? 'risk-bg-medium' : 'risk-bg-low';

  return (
    <div className="pt-20 pb-12 max-w-7xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Farmer Dashboard</h1>
        <p className="text-slate-400 mb-8">📍 {location.name}, {location.state} • Real-time overview of your farm</p>
      </motion.div>

      {/* Alert Banner */}
      {alerts && alerts.length > 0 && alerts[0].severity !== 'low' && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className={`mb-6 p-4 rounded-xl ${alerts[0].severity === 'high' ? 'risk-bg-high' : 'risk-bg-medium'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{alerts[0].severity === 'high' ? '🚨' : '⚠️'}</span>
            <div>
              <div className="font-semibold text-white">{alerts[0].title}</div>
              <div className="text-sm text-slate-300">{alerts[0].message}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '🌡', label: 'Temperature', value: weather?.current?.temp ? `${weather.current.temp}°C` : '--', sub: weather?.current?.description || '' },
          { icon: '💧', label: 'Humidity', value: weather?.current?.humidity ? `${weather.current.humidity}%` : '--', sub: weather?.current?.humidity > 75 ? 'High risk zone' : 'Normal' },
          { icon: '🌧', label: 'Rainfall', value: weather?.current?.rainfall !== undefined ? `${weather.current.rainfall} mm` : '--', sub: 'Last hour' },
          { icon: '💨', label: 'Wind Speed', value: weather?.current?.windSpeed ? `${weather.current.windSpeed} m/s` : '--', sub: weather?.current?.windSpeed > 10 ? 'Do not spray' : 'Safe for spray' }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-slate-400 text-sm">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions + Recent Predictions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { to: '/input', icon: '📥', label: 'Enter Sensor Data', desc: 'Submit manual readings' },
              { to: '/prediction', icon: '🎯', label: 'Get Prediction', desc: 'Run pest/disease analysis' },
              { to: '/weather', icon: '🌦', label: 'View Weather', desc: 'Full forecast & trends' },
              { to: '/detect', icon: '📸', label: 'Scan Crop Image', desc: 'AI disease detection' },
              { to: '/chatbot', icon: '🤖', label: 'Ask AgriBot', desc: 'Get farming advice' },
            ].map((action, i) => (
              <Link key={i} to={action.to} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-all no-underline group">
                <span className="text-xl">{action.icon}</span>
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">{action.label}</div>
                  <div className="text-xs text-slate-500">{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Predictions */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-white">Recent Predictions</h2>
            <Link to="/history" className="text-primary-400 text-sm no-underline hover:underline">View All →</Link>
          </div>
          {recentPredictions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-4xl mb-3">🌾</div>
              <p>No predictions yet. Submit data to get your first forecast!</p>
              <Link to="/input" className="btn-glow inline-block mt-4 px-6 py-2 rounded-lg text-white text-sm no-underline">
                Enter Data →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPredictions.map((pred, i) => (
                <motion.div key={pred._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">🌾</div>
                    <div>
                      <div className="text-sm font-medium text-white">{pred.cropType}</div>
                      <div className="text-xs text-slate-500">{new Date(pred.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className={`px-2 py-1 rounded-full ${riskBg(pred.pestRisk)}`}>
                      🐛 {pred.pestRisk}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${riskBg(pred.diseaseRisk)}`}>
                      🦠 {pred.diseaseRisk}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 7-day Forecast Preview */}
      {weather?.forecast && weather.forecast.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-6 glass-card p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4">📅 7-Day Forecast</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
            {weather.forecast.slice(0, 7).map((day, i) => (
              <div key={i} className="text-center p-3 rounded-lg bg-slate-800/50">
                <div className="text-xs text-slate-500 mb-1">
                  {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <img src={`https://openweathermap.org/img/wn/${day.icon || '02d'}.png`} alt="" className="w-10 h-10 mx-auto" />
                <div className="text-sm font-medium text-white">{Math.round(day.tempMax)}°</div>
                <div className="text-xs text-slate-500">{Math.round(day.tempMin)}°</div>
                <div className="text-xs text-slate-500 mt-1">💧{day.humidity}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
