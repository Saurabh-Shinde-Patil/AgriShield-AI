import mongoose from 'mongoose';
import dns from 'dns';
import net from 'net';
import 'dotenv/config';

// Force IPv4 everywhere
dns.setDefaultResultOrder('ipv4first');
net.setDefaultAutoSelectFamily(false);

const connectDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4,
    });
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Server will continue running, but database features will be unavailable.');
  }
};

export default connectDB;
