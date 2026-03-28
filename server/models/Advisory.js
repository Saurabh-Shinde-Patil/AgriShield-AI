const mongoose = require('mongoose');

const advisorySchema = new mongoose.Schema({
  predictionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prediction' },
  cropType: { type: String, required: true },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  riskType: { type: String, enum: ['pest', 'disease', 'both'], default: 'both' },
  recommendations: [{
    category: { type: String, enum: ['preventive', 'ipm', 'organic', 'chemical', 'general'] },
    title: String,
    description: String,
    priority: { type: String, enum: ['low', 'medium', 'high'] },
    timing: String
  }],
  spraySchedule: {
    recommended: Boolean,
    pesticide: String,
    dosage: String,
    timing: String,
    area: String,
    precautions: [String]
  },
  profitImpact: {
    estimatedSavings: Number,
    pesticideReduction: Number,
    yieldImprovement: Number
  },
  weatherAdvisory: String,
  voiceText: String,
  language: { type: String, default: 'en' }
}, { timestamps: true });

advisorySchema.index({ cropType: 1, riskLevel: 1 });

module.exports = mongoose.model('Advisory', advisorySchema);
