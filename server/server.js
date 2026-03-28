import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route imports
import weatherRoutes from './routes/weather.js';
import predictionRoutes from './routes/prediction.js';
import advisoryRoutes from './routes/advisory.js';
import environmentalRoutes from './routes/environmental.js';
import locationRoutes from './routes/location.js';
import imageAnalysisRoutes from './routes/imageAnalysis.js';
import chatbotRoutes from './routes/chatbot.js';
import alertRoutes from './routes/alerts.js';

// Middleware imports
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/environmental', environmentalRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/analyze-image', imageAnalysisRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/alerts', alertRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AgriShield AI API', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
  res.send('🌱 AgriShield AI API is running...');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌱 AgriShield AI Server running on port ${PORT}`);
});
