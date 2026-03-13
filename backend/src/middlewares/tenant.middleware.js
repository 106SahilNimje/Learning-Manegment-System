/**
 * Tenant context middleware.
 * Sets req.tenantId from the authenticated user's tenant (JWT auth)
 * or leaves it as set by the API key middleware.
 *
 * This middleware should run AFTER both apiKey and auth middlewares.
 */
exports.setTenantContext = (req, res, next) => {
  // If tenantId was already set by API key middleware, keep it
  if (req.tenantId) {
    return next();
  }

  // If user is authenticated via JWT and has a tenant
  if (req.user && req.user.tenantId) {
    req.tenantId = req.user.tenantId;
  }

  next();
};

/**
 * Require tenant context — use on routes that must be tenant-scoped.
 */
exports.requireTenant = (req, res, next) => {
  if (!req.tenantId) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'TENANT_REQUIRED',
        message: 'Tenant context is required for this operation',
      },
    });
  }
  next();
};
