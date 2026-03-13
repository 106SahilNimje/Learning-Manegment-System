const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/ApiResponse');
const { ERROR_CODES } = require('../config/constants');

/**
 * Default rate limiter — 100 requests per 15 minutes per IP.
 */
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, {
      message: 'Too many requests, please try again later',
      statusCode: 429,
      errorCode: ERROR_CODES.RATE_LIMIT_EXCEEDED,
    });
  },
});

/**
 * Strict rate limiter for auth routes — 20 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, {
      message: 'Too many authentication attempts, please try again later',
      statusCode: 429,
      errorCode: ERROR_CODES.RATE_LIMIT_EXCEEDED,
    });
  },
});

module.exports = { defaultLimiter, authLimiter };
