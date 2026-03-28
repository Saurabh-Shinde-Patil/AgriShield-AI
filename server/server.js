/**
 * AgriShield AI — Express Server Entry Point
 *
 * AI-based pest & disease forecasting API for Indian agriculture.
 * Integrates weather data, rule-based prediction engine, and
 * smart advisory system.
 *
 * FUTURE: Hardware sensor endpoints will plug into the existing
 * /api/environmental route for IoT data ingestion.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { REQUEST_BODY_LIMIT } from './config/constants.js';

// ── Route Imports ────────────────────────────────────────────────
import weatherRoutes from './routes/weather.js';
import predictionRoutes from './routes/prediction.js';
import advisoryRoutes from './routes/advisory.js';
import environmentalRoutes from './routes/environmental.js';
import locationRoutes from './routes/location.js';
import imageAnalysisRoutes from './routes/imageAnalysis.js';
import chatbotRoutes from './routes/chatbot.js';
import alertRoutes from './routes/alerts.js';

// ── Middleware Imports ───────────────────────────────────────────
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── Database ─────────────────────────────────────────────────────
connectDB();

// ── Global Middleware ────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,       // Vercel production URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ───────────────────────────────────────────────────
app.use('/api/weather', weatherRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/environmental', environmentalRoutes);  // Also used by hardware sensors
app.use('/api/location', locationRoutes);
app.use('/api/analyze-image', imageAnalysisRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/alerts', alertRoutes);

// ── Health Check (used by Render for uptime monitoring) ──────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AgriShield AI API',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// ── Root ─────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    message: '🌱 AgriShield AI API is running',
    docs: '/health for status',
    version: '1.0.0',
  });
});

// ── Error Handler (must be last) ─────────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health:      http://localhost:${PORT}/health\n`);
});
