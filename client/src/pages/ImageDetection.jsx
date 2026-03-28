import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeImage } from '../services/api';

const cropTypes = ['rice', 'wheat', 'cotton', 'tomato', 'potato', 'sugarcane', 'maize', 'soybean'];

export default function ImageDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cropType, setCropType] = useState('rice');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleFile(e) {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    try {
      const data = await analyzeImage(file, cropType);
      setResult(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  return (
    <div className="pt-20 pb-12 max-w-4xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">📸 AI Disease Detection</h1>
        <p className="text-slate-400 mb-8">Upload a crop image for AI-powered disease identification</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-4">Upload Image</h3>
          
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">Crop Type</label>
            <select value={cropType} onChange={e => setCropType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500">
              {cropTypes.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>

          <label className="block w-full cursor-pointer">
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              preview ? 'border-primary-500' : 'border-slate-600 hover:border-slate-500'}`}>
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
              ) : (
                <>
                  <div className="text-4xl mb-3">📷</div>
                  <p className="text-slate-400 text-sm">Click to upload or drag & drop</p>
                  <p className="text-slate-500 text-xs mt-1">JPG, PNG up to 5MB</p>
                </>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>

          <button onClick={handleAnalyze} disabled={!file || loading}
            className="w-full mt-4 btn-glow py-3 rounded-xl text-white font-semibold border-none cursor-pointer disabled:opacity-50">
            {loading ? '🔍 Analyzing...' : '🧠 Analyze Image'}
          </button>
        </motion.div>

        {/* Results */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-4">Analysis Results</h3>

          {!result ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-4xl mb-3">🔬</div>
              <p>Upload an image to see diagnosis</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Primary Detection */}
              <div className="p-4 rounded-xl risk-bg-high">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Primary Detection</span>
                  <span className="text-xs font-bold text-red-400">
                    {Math.round(result.primary.confidence * 100)}% confidence
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{result.primary.disease}</h4>
                <p className="text-sm text-slate-300 mb-2"><strong>Symptoms:</strong> {result.primary.symptoms}</p>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <span className="text-xs text-primary-400 font-semibold">💊 Recommended Action</span>
                  <p className="text-sm text-slate-300 mt-1">{result.primary.action}</p>
                </div>
              </div>

              {/* Secondary */}
              {result.secondary && (
                <div className="p-4 rounded-xl risk-bg-medium">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Possible Alternative</span>
                    <span className="text-xs font-bold text-amber-400">
                      {Math.round(result.secondary.confidence * 100)}% confidence
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{result.secondary.disease}</h4>
                  <p className="text-sm text-slate-400">{result.secondary.symptoms}</p>
                  <p className="text-sm text-slate-300 mt-2">{result.secondary.action}</p>
                </div>
              )}

              <div className="text-xs text-slate-500 text-center mt-4">
                ⚠️ AI results are suggestive. Confirm with an agricultural expert for treatment.
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
