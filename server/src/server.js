require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database (deferred handling for serverless / local boot)
connectDB().catch((err) => {
  console.warn('[FitTrack Server] Initial DB connection deferred:', err.message);
});

// Initialize Cron Jobs (only when executed directly as standalone server process)
if (!process.env.VERCEL && require.main === module) {
  try {
    const initCronJobs = require('./jobs/cron');
    initCronJobs();
  } catch (err) {
    console.warn('[FitTrack Server] Cron jobs initialization skipped:', err.message);
  }
}

const server = http.createServer(app);

// In local development or standalone container, start HTTP listener when executed directly
if (!process.env.VERCEL && require.main === module) {
  server.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` FitTrack Pro Server running on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Root check:  http://localhost:${PORT}/`);
    console.log(` Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`=================================================`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server...');
    server.close(() => {
      console.log('HTTP server closed.');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received. Closing HTTP server...');
    server.close(() => {
      console.log('HTTP server closed.');
    });
  });
}

// Export the Express app for Vercel serverless function entrypoint
module.exports = app;
