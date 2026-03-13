const adminService = require('./admin.service');
const ApiResponse = require('../../utils/ApiResponse');

class AdminController {
  async getDashboardStats(req, res) {
    try {
      const stats = await adminService.getDashboardStats(req.tenantId);
      return ApiResponse.success(res, { data: stats });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 500,
      });
    }
  }
}

module.exports = new AdminController();
