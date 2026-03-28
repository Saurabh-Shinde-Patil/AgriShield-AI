import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String },
  location: {
    lat: Number,
    lng: Number,
    village: String,
    district: String,
    state: String
  },
  farms: [{
    name: String,
    cropType: String,
    area: Number,
    location: { lat: Number, lng: Number }
  }],
  preferences: {
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
