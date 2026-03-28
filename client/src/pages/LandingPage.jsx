import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  { icon: '🌦', title: 'Weather Intelligence', desc: 'Real-time weather data and 7-day forecasts for precise farming decisions.' },
  { icon: '🧠', title: 'AI Pest Forecasting', desc: 'Rule-based predictions powered by FAO/ICAR models for 8+ crops.' },
  { icon: '📍', title: 'Location-Based Alerts', desc: 'Region-specific risk analysis based on your farm\'s exact location.' },
  { icon: '🌱', title: 'Smart Advisory', desc: 'Eco-friendly IPM recommendations with organic and precision solutions.' },
  { icon: '📸', title: 'Disease Detection', desc: 'Upload crop images for AI-powered disease identification.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track pest trends, profit impact, and field history over time.' },
];

const stats = [
  { value: '8+', label: 'Crops Supported' },
  { value: '50+', label: 'Pest Rules' },
  { value: '10+', label: 'Indian Regions' },
  { value: '24/7', label: 'Real-time Monitoring' },
];

export default function LandingPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/8 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8">
              <span className="animate-pulse-glow inline-block w-2 h-2 rounded-full bg-primary-400"></span>
              AI-Powered Crop Protection
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="gradient-text">AgriShield</span>{' '}
              <span className="text-white">AI</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-4 font-light">
              Predicting pests before they attack using AI, weather intelligence, and smart advisory.
            </p>
            <p className="text-base text-slate-500 max-w-2xl mx-auto mb-10">
              An intelligent decision support system that combines real-time weather data, location analytics, and scientific models to protect your crops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="btn-glow px-8 py-4 rounded-xl text-white font-semibold text-lg no-underline">
                🚀 Launch Dashboard
              </Link>
              <Link to="/input" className="px-8 py-4 rounded-xl border border-slate-600 text-slate-300 font-semibold text-lg hover:bg-slate-800 transition-all no-underline">
                📥 Enter Data
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to protect your crops and maximize yield.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="glass-card p-6 group cursor-pointer">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card p-12">
            <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to Protect Your Crops?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">Start getting AI-powered pest predictions and smart advisory for your farm today.</p>
            <Link to="/dashboard" className="btn-glow inline-block px-10 py-4 rounded-xl text-white font-semibold text-lg no-underline">
              Get Started Free 🌱
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 AgriShield AI — AI-Based Pest & Disease Forecasting System</p>
          <p className="mt-1">Built with ❤️ for Indian Farmers</p>
        </div>
      </footer>
    </div>
  );
}
