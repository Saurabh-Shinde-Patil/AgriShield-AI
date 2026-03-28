import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/weather', label: 'Weather', icon: '🌦' },
  { path: '/input', label: 'Data Input', icon: '📥' },
  { path: '/prediction', label: 'Predictions', icon: '🎯' },
  { path: '/advisory', label: 'Advisory', icon: '🌱' },
  { path: '/risk-map', label: 'Risk Map', icon: '🗺' },
  { path: '/detect', label: 'AI Detect', icon: '📸' },
  { path: '/chatbot', label: 'Chatbot', icon: '🤖' },
  { path: '/history', label: 'History', icon: '📈' },
  { path: '/profit', label: 'Impact', icon: '💰' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl">🌱</span>
            <span className="font-display text-xl font-bold gradient-text hidden sm:inline">AgriShield AI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all no-underline ${
                  loc.pathname === link.path
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span className="mr-1">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white bg-transparent border-none cursor-pointer text-xl"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{ background: 'rgba(15, 23, 42, 0.95)' }}
          >
            <div className="px-4 py-3 grid grid-cols-2 gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm no-underline ${
                    loc.pathname === link.path
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
