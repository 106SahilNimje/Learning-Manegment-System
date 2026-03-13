const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body, req.tenantId);
      return ApiResponse.created(res, { data: result, message: 'User registered successfully' });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
        errorCode: error.errorCode || 'VALIDATION_ERROR',
      });
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return ApiResponse.success(res, { data: result, message: 'Login successful' });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 401,
        errorCode: error.errorCode || 'AUTHENTICATION_ERROR',
      });
    }
  }

  async getMe(req, res, next) {
    try {
      return ApiResponse.success(res, { data: { user: req.user } });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: 400,
      });
    }
  }
}

module.exports = new AuthController();
