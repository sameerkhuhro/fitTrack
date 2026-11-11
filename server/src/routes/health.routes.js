const express = require('express');
const router = express.Router();
const { getDBStatus } = require('../config/db');

router.get('/health', (req, res) => {
  const dbStatus = getDBStatus();
  
  const healthData = {
    status: 'ok',
    service: 'FitTrack Pro Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json(healthData);
});

module.exports = router;

