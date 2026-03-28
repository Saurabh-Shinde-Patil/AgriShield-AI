import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { generateAdvisory } from '../services/api';

export default function AdvisoryPage() {
  const { latestPrediction, latestAdvisory, setLatestAdvisory } = useApp();
  const [advisory, setAdvisory] = useState(latestAdvisory);
  const [speaking, setSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (latestPrediction && !latestAdvisory) {
      generateAdvisory(latestPrediction).then(data => { setAdvisory(data); setLatestAdvisory(data); }).catch(console.error);
    } else if (latestAdvisory) { setAdvisory(latestAdvisory); }
  }, [latestPrediction, latestAdvisory]);

  function speak(text) {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  if (!advisory) {
    return (
      <div className="pt-20 pb-12 max-w-4xl mx-auto px-4 text-center">
        <div className="glass-card p-12">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">No Advisory Available</h2>
          <p className="text-slate-400 mb-6">Generate a prediction first to get smart recommendations.</p>
          <Link to="/input" className="btn-glow inline-block px-8 py-3 rounded-xl text-white font-semibold no-underline">📥 Enter Data</Link>
        </div>
      </div>
    );
  }

  const categoryLabels = { preventive: '🛡 Preventive', ipm: '🐛 IPM', organic: '🌿 Organic', chemical: '💊 Chemical', general: '📋 General' };
  const categories = ['all', ...new Set(advisory.recommendations?.map(r => r.category) || [])];
  const filtered = activeTab === 'all' ? advisory.recommendations : advisory.recommendations?.filter(r => r.category === activeTab);

  return (
    <div className="pt-20 pb-12 max-w-5xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display text-3xl font-bold text-white">🌱 Smart Advisory</h1>
          <button onClick={() => speak(advisory.voiceText || '')}
            className={`px-4 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all ${speaking ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-primary-500/10 border-primary-500 text-primary-400 hover:bg-primary-500/20'}`}>
            {speaking ? '🔇 Stop' : '🔊 Listen'}
          </button>
        </div>
        <p className="text-slate-400 mb-8">Context-aware recommendations for {advisory.cropType} — Risk Level: <span className={advisory.riskLevel === 'High' ? 'text-red-400' : advisory.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}>{advisory.riskLevel}</span></p>
      </motion.div>

      {/* Weather Advisory */}
      {advisory.weatherAdvisory && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-5 mb-6">
          <h3 className="font-display font-semibold text-white mb-2">🌦 Weather Advisory</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{advisory.weatherAdvisory}</p>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border-none cursor-pointer transition-all capitalize ${activeTab === cat ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {cat === 'all' ? '📋 All' : categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Recommendations */}
      <div className="space-y-4 mb-8">
        {filtered?.map((rec, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5">
            <div className="flex items-start gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${rec.priority === 'high' ? 'risk-bg-high' : rec.priority === 'medium' ? 'risk-bg-medium' : 'risk-bg-low'}`}>
                {rec.priority}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-500">{categoryLabels[rec.category] || rec.category}</span>
                </div>
                <h4 className="text-white font-semibold mb-1">{rec.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{rec.description}</p>
                {rec.timing && <p className="text-xs text-primary-400 mt-2">⏰ {rec.timing}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Spray Schedule */}
      {advisory.spraySchedule && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-6">
          <h3 className="font-display text-lg font-semibold text-white mb-4">💊 Precision Spraying Schedule</h3>
          {advisory.spraySchedule.recommended ? (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <span className="text-xs text-slate-500">Pesticide</span>
                  <div className="text-white text-sm mt-1">{advisory.spraySchedule.pesticide}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <span className="text-xs text-slate-500">Dosage</span>
                  <div className="text-white text-sm mt-1">{advisory.spraySchedule.dosage}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <span className="text-xs text-slate-500">Timing</span>
                  <div className="text-white text-sm mt-1">{advisory.spraySchedule.timing}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <span className="text-xs text-slate-500">Target Area</span>
                  <div className="text-white text-sm mt-1">{advisory.spraySchedule.area}</div>
                </div>
              </div>
              {advisory.spraySchedule.precautions?.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="text-xs text-amber-400 font-semibold">⚠️ Safety Precautions</span>
                  <ul className="mt-2 space-y-1">
                    {advisory.spraySchedule.precautions.map((p, i) => (
                      <li key={i} className="text-sm text-slate-300">• {p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 text-slate-400">
              <span className="text-3xl">✅</span>
              <p className="mt-2">No spraying required. Risk levels are within safe limits.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Profit Impact */}
      {advisory.profitImpact && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-4">💰 Estimated Impact</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-2xl font-bold text-emerald-400">₹{advisory.profitImpact.estimatedSavings?.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Est. Savings/ha</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">{advisory.profitImpact.pesticideReduction}%</div>
              <div className="text-xs text-slate-400 mt-1">Pesticide Reduced</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="text-2xl font-bold text-amber-400">+{advisory.profitImpact.yieldImprovement}%</div>
              <div className="text-xs text-slate-400 mt-1">Yield Improvement</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
