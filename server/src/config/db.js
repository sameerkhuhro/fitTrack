const mongoose = require('mongoose');

// Global caching pattern for serverless environments (e.g. Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If already connected and readyState is 1 (connected), reuse the connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fittrack_pro';

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: process.env.VERCEL ? 10 : 50,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`[FitTrack Server] MongoDB connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    }).catch((error) => {
      cached.promise = null;
      console.error(`[FitTrack Server] MongoDB Connection Error: ${error.message}`);
      console.warn(`[FitTrack Server] To use a live database:`);
      console.warn(`  1. Update MONGODB_URI in environment variables with your MongoDB Atlas connection string`);
      console.warn(`  2. Ensure IP Access List on MongoDB Atlas includes 0.0.0.0/0 for Vercel deployment`);
      if (!process.env.VERCEL && process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};

const getDBStatus = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return {
    state: states[state] || 'unknown',
    connected: state === 1,
  };
};

module.exports = { connectDB, getDBStatus };
