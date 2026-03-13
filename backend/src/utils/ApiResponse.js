/**
 * Standardized API Response wrapper
 * Ensures all API responses follow a consistent envelope format.
 */
class ApiResponse {
  /**
   * Send a success response
   */
  static success(res, { data = null, message = null, meta = null, statusCode = 200 } = {}) {
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
    };

    if (message) response.message = message;
    if (data !== null && data !== undefined) response.data = data;
    if (meta) response.meta = meta;

    return res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   */
  static created(res, { data = null, message = 'Resource created successfully' } = {}) {
    return ApiResponse.success(res, { data, message, statusCode: 201 });
  }

  /**
   * Send a paginated success response
   */
  static paginated(res, { data, page, limit, total }) {
    const totalPages = Math.ceil(total / limit);
    return ApiResponse.success(res, {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }

  /**
   * Send an error response
   */
  static error(res, { message = 'Internal Server Error', statusCode = 500, errorCode = 'INTERNAL_ERROR', details = null } = {}) {
    const response = {
      success: false,
      timestamp: new Date().toISOString(),
      error: {
        code: errorCode,
        message,
      },
    };

    if (details) response.error.details = details;

    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
