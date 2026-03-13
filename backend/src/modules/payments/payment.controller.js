const paymentService = require('./payment.service');
const ApiResponse = require('../../utils/ApiResponse');

class PaymentController {
  async createOrder(req, res, next) {
    try {
      const { courseId } = req.body;
      const order = await paymentService.createOrder(req.user.id, courseId);
      return ApiResponse.success(res, { data: order });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
        errorCode: error.errorCode || 'PAYMENT_ERROR',
      });
    }
  }

  async verifyPayment(req, res, next) {
    try {
      await paymentService.verifyPayment(req.body);
      return ApiResponse.success(res, { message: 'Payment verified successfully' });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
        errorCode: error.errorCode || 'PAYMENT_ERROR',
      });
    }
  }
}

module.exports = new PaymentController();
