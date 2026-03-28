import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas
 * Handles connection errors gracefully — server continues running
 * even if the database is unavailable.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Server will continue without database features.');
  }
};

export default connectDB;
