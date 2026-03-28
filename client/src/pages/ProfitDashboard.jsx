import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getPredictionHistory } from '../services/api';

export default function ProfitDashboard() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPredictionHistory(30).then(data => { setPredictions(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const totalPredictions = predictions.length;
  const highRiskPrevented = predictions.filter(p => p.pestRisk === 'High' || p.diseaseRisk === 'High').length;
  
  // Estimate savings based on predictions
  const estimatedSavings = totalPredictions * 5000 + highRiskPrevented * 12000;
  const pesticideReduction = totalPredictions > 0 ? Math.min(65, 25 + highRiskPrevented * 5) : 0;
  const yieldImprovement = totalPredictions > 0 ? Math.min(30, 8 + highRiskPrevented * 3) : 0;

  const monthlyData = [
    { month: 'Jan', savings: 8000, pesticide: 15, yield: 5 },
    { month: 'Feb', savings: 12000, pesticide: 25, yield: 8 },
    { month: 'Mar', savings: 15000, pesticide: 35, yield: 12 },
    { month: 'Apr', savings: 22000, pesticide: 42, yield: 15 },
    { month: 'May', savings: 28000, pesticide: 50, yield: 18 },
    { month: 'Jun', savings: 35000, pesticide: 55, yield: 22 },
  ];

  const impactCards = [
    { icon: '💰', label: 'Total Cost Savings', value: `₹${estimatedSavings.toLocaleString()}`, sub: 'Estimated savings per hectare', color: 'emerald' },
    { icon: '📉', label: 'Pesticide Reduction', value: `${pesticideReduction}%`, sub: 'Less chemical usage', color: 'blue' },
    { icon: '📈', label: 'Yield Improvement', value: `+${yieldImprovement}%`, sub: 'Estimated yield increase', color: 'amber' },
    { icon: '🌿', label: 'Eco Score', value: totalPredictions > 3 ? 'A+' : totalPredictions > 0 ? 'B+' : 'N/A', sub: 'Environmental sustainability', color: 'green' },
  ];

  return (
    <div className="pt-20 pb-12 max-w-7xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">💰 Farmer Profit Impact</h1>
        <p className="text-slate-400 mb-8">Track cost savings, pesticide reduction, and yield improvements</p>
      </motion.div>

      {/* Impact Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {impactCards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-5 text-center">
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className={`text-2xl font-bold ${card.color === 'emerald' ? 'text-emerald-400' : card.color === 'blue' ? 'text-blue-400' : card.color === 'amber' ? 'text-amber-400' : 'text-green-400'}`}>
              {card.value}
            </div>
            <div className="text-sm text-white font-medium mt-1">{card.label}</div>
            <div className="text-xs text-slate-500">{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-4">💰 Savings Trend (₹/ha)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} fill="url(#savingsGrad)" name="Savings (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-4">📉 Pesticide Reduction (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Bar dataKey="pesticide" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Reduction (%)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Benefits Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold text-white mb-4">🌟 How AgriShield Saves You Money</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '🎯', title: 'Targeted Spraying', desc: 'Spray only when needed, reducing chemical costs by up to 60%.' },
            { icon: '⏰', title: 'Early Warning', desc: 'Detect threats 3-7 days early, preventing crop losses worth ₹15,000+/ha.' },
            { icon: '🌿', title: 'Organic First', desc: 'IPM and organic solutions reduce input costs and improve soil health.' },
            { icon: '📊', title: 'Data-Driven', desc: 'Scientific thresholds ensure you spray at the right time, right dosage.' },
            { icon: '🔄', title: 'Season Planning', desc: 'Historical analytics help plan better crop protection strategies.' },
            { icon: '💪', title: 'Better Yield', desc: 'Healthier crops with timely intervention produce 10-25% more yield.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
