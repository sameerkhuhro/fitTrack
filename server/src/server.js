require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Initialize Cron Jobs
try {
  const initCronJobs = require('./jobs/cron');
  initCronJobs();
} catch (err) {
  // Cron jobs will be initialized once the jobs module is created
}

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` FitTrack Pro Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
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

