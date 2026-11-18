const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Route imports
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const planRoutes = require('./routes/plan.routes');
const trainerRoutes = require('./routes/trainer.routes');
const memberRoutes = require('./routes/member.routes');
const membershipRoutes = require('./routes/membership.routes');
const paymentRoutes = require('./routes/payment.routes');
const salaryRoutes = require('./routes/salary.routes');
const exerciseRoutes = require('./routes/exercise.routes');
const workoutRoutes = require('./routes/workout.routes');
const sessionRoutes = require('./routes/session.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const progressRoutes = require('./routes/progress.routes');
const notificationRoutes = require('./routes/notification.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const contactRoutes = require('./routes/contact.routes');

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:80',
  'http://localhost',
];

const allowedOrigins = [...new Set([...configuredOrigins, ...defaultOrigins])];

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, curl, mobile, server-to-server)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, '');

    // Allow explicitly configured origins or development mode
    if (allowedOrigins.includes(normalizedOrigin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Allow all Vercel deployments (*.vercel.app)
    try {
      const hostname = new URL(origin).hostname;
      if (hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch (e) {
      // Invalid URL format
    }

    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static folder for file uploads (supports /tmp in serverless environments)
const uploadDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.resolve(__dirname, '..', process.env.UPLOAD_PATH || 'uploads');
app.use('/uploads', express.static(uploadDir));

// Database connection assurance for serverless invocations
const { connectDB } = require('./config/db');

app.use(async (req, res, next) => {
  // Bypass DB check for root, health and static routes so health checks stay fast and never fail
  if (req.path === '/' || req.path === '/api/v1' || req.path === '/api/v1/health' || req.path.startsWith('/uploads')) {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[Database Middleware Error]', err.message);
    return res.status(503).json({
      success: false,
      message: 'Database connection currently unavailable. Please verify MONGODB_URI.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Root entrypoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'FitTrack Pro Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      plans: '/api/v1/plans',
      trainers: '/api/v1/trainers'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// Mount API Endpoints
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/memberships', membershipRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/salaries', salaryRoutes);
app.use('/api/v1/exercises', exerciseRoutes);
app.use('/api/v1/workouts', workoutRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1', contactRoutes);

// 404 Route Handler
app.use('/api/v1/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[FitTrack Server Error]', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
