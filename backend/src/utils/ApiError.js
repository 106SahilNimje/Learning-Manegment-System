const { ERROR_CODES } = require('../config/constants');

/**
 * Custom API Error class with status code and error code support.
 * Designed for machine-readable error handling by external systems.
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, errorCode = ERROR_CODES.INTERNAL_ERROR, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }

  // ─── Factory Methods ────────────────────────────────

  static badRequest(message = 'Bad Request', details = null) {
    return new ApiError(message, 400, ERROR_CODES.VALIDATION_ERROR, details);
  }

  static unauthorized(message = 'Not authorized to access this route') {
    return new ApiError(message, 401, ERROR_CODES.AUTHENTICATION_ERROR);
  }

  static forbidden(message = 'You do not have permission to perform this action') {
    return new ApiError(message, 403, ERROR_CODES.AUTHORIZATION_ERROR);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404, ERROR_CODES.NOT_FOUND);
  }

  static conflict(message = 'Resource already exists') {
    return new ApiError(message, 409, ERROR_CODES.CONFLICT);
  }

  static rateLimited(message = 'Too many requests, please try again later') {
    return new ApiError(message, 429, ERROR_CODES.RATE_LIMIT_EXCEEDED);
  }

  static paymentError(message = 'Payment processing failed') {
    return new ApiError(message, 402, ERROR_CODES.PAYMENT_ERROR);
  }

  static tenantInactive(message = 'Tenant account is inactive') {
    return new ApiError(message, 403, ERROR_CODES.TENANT_INACTIVE);
  }
}

module.exports = ApiError;
