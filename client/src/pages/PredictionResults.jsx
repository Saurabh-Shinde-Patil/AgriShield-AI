import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getAdvisory } from '../services/api';

function RiskGauge({ label, level, score, icon }) {
  const color = level === 'High' ? '#ef4444' : level === 'Medium' ? '#f59e0b' : '#10b981';
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <svg width="130" height="130" className="transform -rotate-90">
          <circle cx="65" cy="65" r="45" stroke="#334155" strokeWidth="10" fill="none" />
          <motion.circle
            cx="65" cy="65" r="45" stroke={color} strokeWidth="10" fill="none"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{icon}</span>
          <span className="text-xl font-bold text-white">{score}%</span>
        </div>
      </div>
      <div className="mt-2">
        <div className="text-sm text-slate-400">{label}</div>
        <div className={`text-lg font-bold ${level === 'High' ? 'text-red-400' : level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
          {level} Risk
        </div>
      </div>
    </div>
  );
}

export default function PredictionResults() {
  const { latestPrediction } = useApp();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(latestPrediction);

  useEffect(() => {
    if (!latestPrediction) return;
    setPrediction(latestPrediction);
  }, [latestPrediction]);

  if (!prediction) {
    return (
      <div className="pt-20 pb-12 max-w-4xl mx-auto px-4 text-center">
        <div className="glass-card p-12">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">No Prediction Available</h2>
          <p className="text-slate-400 mb-6">Submit environmental data to generate a pest & disease forecast.</p>
          <Link to="/input" className="btn-glow inline-block px-8 py-3 rounded-xl text-white font-semibold no-underline">
            📥 Enter Data
          </Link>
        </div>
      </div>
    );
  }

  const overallRisk = prediction.pestScore > prediction.diseaseScore ? prediction.pestRisk : prediction.diseaseRisk;
  
  return (
    <div className="pt-20 pb-12 max-w-5xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">🎯 Prediction Results</h1>
        <p className="text-slate-400 mb-8">AI-powered pest & disease risk analysis for {prediction.cropType}</p>
      </motion.div>

      {/* Overall Status Banner */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl mb-8 ${overallRisk === 'High' ? 'risk-bg-high' : overallRisk === 'Medium' ? 'risk-bg-medium' : 'risk-bg-low'}`}>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{overallRisk === 'High' ? '🚨' : overallRisk === 'Medium' ? '⚠️' : '✅'}</span>
          <div>
            <div className="text-2xl font-bold text-white">{overallRisk} Risk Detected</div>
            <div className="text-slate-300">{overallRisk === 'High' ? 'Immediate action required!' : overallRisk === 'Medium' ? 'Monitor closely and take preventive measures.' : 'Conditions are favorable. Continue regular monitoring.'}</div>
          </div>
        </div>
      </motion.div>

      {/* Risk Gauges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-8 mb-6">
        <div className="grid sm:grid-cols-2 gap-8 justify-items-center">
          <RiskGauge label="Pest Risk" level={prediction.pestRisk} score={prediction.pestScore} icon="🐛" />
          <RiskGauge label="Disease Risk" level={prediction.diseaseRisk} score={prediction.diseaseScore} icon="🦠" />
        </div>
      </motion.div>

      {/* Threats */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Primary Pests */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-4">🐛 Identified Pest Threats</h3>
          {prediction.primaryPests?.length > 0 ? prediction.primaryPests.map((pest, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 mb-2">
              <span className="text-white text-sm">{pest.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pest.probability}%`, background: pest.probability > 60 ? '#ef4444' : pest.probability > 35 ? '#f59e0b' : '#10b981' }}></div>
                </div>
                <span className="text-xs text-slate-400">{pest.probability}%</span>
              </div>
            </div>
          )) : <p className="text-slate-500 text-sm">No significant pest threats detected</p>}
        </motion.div>

        {/* Primary Diseases */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-4">🦠 Identified Disease Threats</h3>
          {prediction.primaryDiseases?.length > 0 ? prediction.primaryDiseases.map((disease, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 mb-2">
              <span className="text-white text-sm">{disease.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${disease.probability}%`, background: disease.probability > 60 ? '#ef4444' : disease.probability > 35 ? '#f59e0b' : '#10b981' }}></div>
                </div>
                <span className="text-xs text-slate-400">{disease.probability}%</span>
              </div>
            </div>
          )) : <p className="text-slate-500 text-sm">No significant disease threats detected</p>}
        </motion.div>
      </div>

      {/* Contributing Factors */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-6 mb-6">
        <h3 className="font-display text-lg font-semibold text-white mb-4">📊 Contributing Factors</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {prediction.factors?.map((factor, i) => (
            <div key={i} className={`p-4 rounded-xl ${factor.impact === 'High' ? 'risk-bg-high' : factor.impact === 'Medium' ? 'risk-bg-medium' : 'risk-bg-low'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-white">{factor.parameter}</span>
                <span className="text-sm font-bold">{factor.value}{factor.parameter === 'Temperature' ? '°C' : factor.parameter === 'Rainfall' ? ' mm' : '%'}</span>
              </div>
              <p className="text-xs text-slate-400">{factor.contribution}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/advisory" className="flex-1 btn-glow text-center py-3 rounded-xl text-white font-semibold no-underline">
          🌱 View Advisory
        </Link>
        <Link to="/input" className="flex-1 text-center py-3 rounded-xl border border-slate-600 text-slate-300 font-semibold hover:bg-slate-800 transition-all no-underline">
          📥 New Prediction
        </Link>
      </div>
    </div>
  );
}
