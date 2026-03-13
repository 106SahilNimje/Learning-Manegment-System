const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { API_PREFIX } = require('./config/constants');
const ApiResponse = require('./utils/ApiResponse');
const { defaultLimiter } = require('./middlewares/rateLimiter.middleware');
const { authenticateApiKey } = require('./middlewares/apiKey.middleware');
const { setTenantContext } = require('./middlewares/tenant.middleware');

const app = express();

// ─── Global Middleware ──────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(defaultLimiter);

// ─── API Key & Tenant Middleware (runs on all /api routes) ─
app.use(API_PREFIX, authenticateApiKey);
app.use(API_PREFIX, setTenantContext);

// ─── Health Check ───────────────────────────────────────
app.get(`${API_PREFIX}/health`, (req, res) => {
  return ApiResponse.success(res, {
    data: {
      status: 'healthy',
      version: '1.0.0',
      uptime: process.uptime(),
    },
    message: 'LMS Core Engine is running',
  });
});

// ─── Import Routes ──────────────────────────────────────
const authRoutes = require('./modules/auth/auth.routes');
const courseRoutes = require('./modules/courses/course.routes');
const enrollmentRoutes = require('./modules/enrollments/enrollment.routes');
const paymentRoutes = require('./modules/payments/payment.routes');
const certificateRoutes = require('./modules/certificates/certificate.routes');
const tenantRoutes = require('./modules/tenants/tenant.routes');
const adminRoutes = require('./modules/admin/admin.routes');

// ─── Mount Routes under /api/v1 ────────────────────────
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/courses`, courseRoutes);
app.use(`${API_PREFIX}/enrollments`, enrollmentRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/certificates`, certificateRoutes);
app.use(`${API_PREFIX}/tenants`, tenantRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);

// ─── Legacy Route Redirect ─────────────────────────────
// Redirect old /api/* routes to /api/v1/* for backward compatibility
app.use('/api', (req, res, next) => {
  // Only redirect if it's not already going to /api/v1
  if (!req.originalUrl.startsWith(API_PREFIX)) {
    const newPath = req.originalUrl.replace('/api', API_PREFIX);
    return res.redirect(307, newPath);
  }
  next();
});

// ─── 404 Handler ────────────────────────────────────────
app.use((req, res) => {
  return ApiResponse.error(res, {
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404,
    errorCode: 'NOT_FOUND',
  });
});

// ─── Error Handling Middleware ───────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_ERROR';

  return ApiResponse.error(res, {
    message: err.message || 'Internal Server Error',
    statusCode,
    errorCode,
  });
});

module.exports = app;
