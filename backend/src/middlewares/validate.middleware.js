const ApiResponse = require('../utils/ApiResponse');
const { ERROR_CODES } = require('../config/constants');

/**
 * Generic Zod validation middleware factory.
 * Validates request body, params, and/or query against Zod schemas.
 *
 * Usage:
 *   const { z } = require('zod');
 *   const schema = z.object({ body: z.object({ name: z.string() }) });
 *   router.post('/items', validate(schema), controller.create);
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      const dataToValidate = {};
      if (schema.shape.body) dataToValidate.body = req.body;
      if (schema.shape.params) dataToValidate.params = req.params;
      if (schema.shape.query) dataToValidate.query = req.query;

      schema.parse(dataToValidate);
      next();
    } catch (error) {
      const details = error.errors
        ? error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        : [];

      return ApiResponse.error(res, {
        message: 'Validation failed',
        statusCode: 400,
        errorCode: ERROR_CODES.VALIDATION_ERROR,
        details,
      });
    }
  };
}

module.exports = validate;
