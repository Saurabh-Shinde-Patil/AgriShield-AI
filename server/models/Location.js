import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  village: String,
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  region: String,
  agroClimaticZone: String,
  commonCrops: [String],
  historicalPests: [String]
}, { timestamps: true });

locationSchema.index({ lat: 1, lng: 1 });
locationSchema.index({ state: 1, district: 1 });

export default mongoose.model('Location', locationSchema);
