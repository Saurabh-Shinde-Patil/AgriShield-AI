require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/weather', require('./routes/weather'));
app.use('/predict', require('./routes/prediction'));
app.use('/advisory', require('./routes/advisory'));
app.use('/environmental', require('./routes/environmental'));
app.use('/location', require('./routes/location'));
app.use('/analyze-image', require('./routes/imageAnalysis'));
app.use('/chatbot', require('./routes/chatbot'));
app.use('/alerts', require('./routes/alerts'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AgriShield AI API', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌱 AgriShield AI Server running on port ${PORT}`);
});
