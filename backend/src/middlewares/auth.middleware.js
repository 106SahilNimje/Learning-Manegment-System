const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Protect routes — verifies JWT and attaches user (with tenantId) to req.
 */
exports.protect = async (req, res, next) => {
  // If already authenticated via API key, skip JWT
  if (req.authMethod === 'apikey') {
    return next();
  }

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.error(res, {
      message: 'Not authorized to access this route',
      statusCode: 401,
      errorCode: 'AUTHENTICATION_ERROR',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, tenantId: true },
    });

    if (!user) {
      return ApiResponse.error(res, {
        message: 'User no longer exists',
        statusCode: 401,
        errorCode: 'AUTHENTICATION_ERROR',
      });
    }

    req.user = user;

    // Set tenant context from user if not already set
    if (!req.tenantId && user.tenantId) {
      req.tenantId = user.tenantId;
    }

    next();
  } catch (err) {
    return ApiResponse.error(res, {
      message: 'Not authorized to access this route',
      statusCode: 401,
      errorCode: 'AUTHENTICATION_ERROR',
    });
  }
};

/**
 * Authorize specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // API key auth bypasses role checks (external systems have full tenant access)
    if (req.authMethod === 'apikey') {
      return next();
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(res, {
        message: `User role ${req.user?.role || 'unknown'} is not authorized to access this route`,
        statusCode: 403,
        errorCode: 'AUTHORIZATION_ERROR',
      });
    }
    next();
  };
};
