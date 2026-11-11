const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fittrack_pro';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[FitTrack Server] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[FitTrack Server] MongoDB Connection Error: ${error.message}`);
    console.warn(`[FitTrack Server] To use a live database:`);
    console.warn(`  1. Update MONGODB_URI in server/.env with your MongoDB Atlas or local MongoDB URI`);
    console.warn(`  2. Or run: docker run -d -p 27017:27017 --name fittrack-mongo mongo:latest`);
    // In development mode, we allow the server to remain alive for health checks and UI testing
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
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

