import mongoose from 'mongoose';

const environmentalDataSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  locationName: String,
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  soilMoisture: { type: Number, required: true },
  rainfall: { type: Number, default: 0 },
  cropType: { type: String, required: true },
  source: { type: String, enum: ['manual', 'sensor', 'api'], default: 'manual' },
  deviceId: String,
  notes: String
}, { timestamps: true });

environmentalDataSchema.index({ cropType: 1, createdAt: -1 });

export default mongoose.model('EnvironmentalData', environmentalDataSchema);
