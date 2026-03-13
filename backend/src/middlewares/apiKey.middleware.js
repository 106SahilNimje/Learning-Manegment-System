const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

/**
 * API Key authentication middleware.
 * Authenticates external systems via the X-API-Key header.
 * Resolves the associated tenant and sets req.tenantId.
 */
exports.authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(); // No API key — fall through to JWT auth
  }

  try {
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { tenant: true },
    });

    if (!keyRecord || !keyRecord.isActive) {
      throw ApiError.unauthorized('Invalid or inactive API key');
    }

    if (!keyRecord.tenant.isActive) {
      throw ApiError.tenantInactive();
    }

    // Set tenant context
    req.tenantId = keyRecord.tenantId;
    req.authMethod = 'apikey';
    req.apiKeyLabel = keyRecord.label;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        error: { code: error.errorCode, message: error.message },
      });
    }
    next(error);
  }
};
