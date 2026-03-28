import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getPredictionHistory } from '../services/api';

const RISK_COLORS = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' };

export default function HistoryAnalytics() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPredictionHistory(50).then(data => { setPredictions(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const trendData = predictions.slice().reverse().map((p, i) => ({
    index: i + 1,
    date: new Date(p.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    pestScore: p.pestScore,
    diseaseScore: p.diseaseScore,
    crop: p.cropType
  }));

  const riskDistribution = ['Low', 'Medium', 'High'].map(level => ({
    name: level,
    value: predictions.filter(p => p.pestRisk === level || p.diseaseRisk === level).length,
    color: RISK_COLORS[level]
  }));

  const cropStats = {};
  predictions.forEach(p => {
    const key = p.cropType;
    if (!cropStats[key]) cropStats[key] = { count: 0, avgPest: 0, avgDisease: 0 };
    cropStats[key].count++;
    cropStats[key].avgPest += p.pestScore || 0;
    cropStats[key].avgDisease += p.diseaseScore || 0;
  });
  Object.values(cropStats).forEach(s => { s.avgPest = Math.round(s.avgPest / s.count); s.avgDisease = Math.round(s.avgDisease / s.count); });

  return (
    <div className="pt-20 pb-12 max-w-7xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">📈 History & Analytics</h1>
        <p className="text-slate-400 mb-8">Track pest trends and prediction performance over time</p>
      </motion.div>

      {predictions.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">
          <div className="text-5xl mb-3">📊</div>
          <p>No prediction history yet. Start by submitting data.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Predictions', value: predictions.length, icon: '🔮' },
              { label: 'High Risk Alerts', value: predictions.filter(p => p.pestRisk === 'High' || p.diseaseRisk === 'High').length, icon: '🚨' },
              { label: 'Crops Analyzed', value: Object.keys(cropStats).length, icon: '🌾' },
              { label: 'Avg Pest Score', value: Math.round(predictions.reduce((a, p) => a + (p.pestScore || 0), 0) / predictions.length), icon: '🐛' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-5 text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Trend Line */}
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-4">Risk Score Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="pestScore" stroke="#f59e0b" strokeWidth={2} name="Pest Risk" dot={{ fill: '#f59e0b', r: 3 }} />
                  <Line type="monotone" dataKey="diseaseScore" stroke="#ef4444" strokeWidth={2} name="Disease Risk" dot={{ fill: '#ef4444', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Distribution Pie */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-4">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {riskDistribution.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Prediction Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-6 overflow-x-auto">
            <h3 className="font-display text-lg font-semibold text-white mb-4">Prediction History</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Date</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Crop</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Pest Risk</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Disease Risk</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Temp</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Humidity</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p, i) => (
                  <tr key={p._id || i} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 text-slate-300">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-3 text-white font-medium">{p.cropType}</td>
                    <td className="py-3 px-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${p.pestRisk === 'High' ? 'risk-bg-high' : p.pestRisk === 'Medium' ? 'risk-bg-medium' : 'risk-bg-low'}`}>{p.pestRisk} ({p.pestScore})</span></td>
                    <td className="py-3 px-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${p.diseaseRisk === 'High' ? 'risk-bg-high' : p.diseaseRisk === 'Medium' ? 'risk-bg-medium' : 'risk-bg-low'}`}>{p.diseaseRisk} ({p.diseaseScore})</span></td>
                    <td className="py-3 px-3 text-slate-300">{p.weatherSnapshot?.temp}°C</td>
                    <td className="py-3 px-3 text-slate-300">{p.weatherSnapshot?.humidity}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </div>
  );
}
