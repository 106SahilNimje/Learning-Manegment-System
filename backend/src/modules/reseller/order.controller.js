const orderService = require('./order.service');
const organizationService = require('./organization.service');
const ApiResponse = require('../../utils/ApiResponse');

class ResellerOrderController {
  /**
   * Create a course purchase order (public — student on reseller storefront).
   */
  async createOrder(req, res) {
    try {
      const result = await orderService.createOrder(req.params.slug, req.body);
      return ApiResponse.created(res, { data: result, message: 'Order created, proceed with payment' });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  /**
   * Verify payment and trigger auto-enrollment.
   */
  async verifyPayment(req, res) {
    try {
      const result = await orderService.verifyPayment(req.body);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  /**
   * Get orders for the logged-in reseller.
   */
  async getMyOrders(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      const orders = await orderService.getOrganizationOrders(org.id);
      return ApiResponse.success(res, { data: orders });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  /**
   * Get all orders (Platform Admin).
   */
  async getAllOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders();
      return ApiResponse.success(res, { data: orders });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 500 });
    }
  }
}

module.exports = new ResellerOrderController();
