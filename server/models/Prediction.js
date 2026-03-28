import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  locationName: String,
  cropType: { type: String, required: true },
  pestRisk: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  diseaseRisk: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  pestScore: { type: Number, min: 0, max: 100 },
  diseaseScore: { type: Number, min: 0, max: 100 },
  primaryPests: [{ name: String, probability: Number }],
  primaryDiseases: [{ name: String, probability: Number }],
  factors: [{
    parameter: String,
    value: Number,
    impact: String,
    contribution: String
  }],
  weatherSnapshot: {
    temp: Number,
    humidity: Number,
    rainfall: Number,
    windSpeed: Number,
    soilMoisture: Number
  },
  inputSource: { type: String, enum: ['weather', 'manual', 'combined'], default: 'combined' },
  validUntil: Date
}, { timestamps: true });

predictionSchema.index({ cropType: 1, createdAt: -1 });
predictionSchema.index({ pestRisk: 1, diseaseRisk: 1 });

export default mongoose.model('Prediction', predictionSchema);
