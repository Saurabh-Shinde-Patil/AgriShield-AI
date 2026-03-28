import mongoose from 'mongoose';

const weatherLogSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  locationName: String,
  current: {
    temp: Number,
    humidity: Number,
    pressure: Number,
    windSpeed: Number,
    rainfall: Number,
    description: String,
    icon: String,
    feelsLike: Number,
    visibility: Number
  },
  forecast: [{
    date: Date,
    tempMin: Number,
    tempMax: Number,
    humidity: Number,
    rainfall: Number,
    windSpeed: Number,
    description: String,
    icon: String
  }],
  fetchedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 60 * 1000) }
}, { timestamps: true });

weatherLogSchema.index({ lat: 1, lng: 1, fetchedAt: -1 });
weatherLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('WeatherLog', weatherLogSchema);
