const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const RazorpayGateway = require('./gateways/RazorpayGateway');

class PaymentService {
  constructor() {
    // Gateway adapter — swap this to use a different provider
    this.gateway = new RazorpayGateway();
  }

  async createOrder(userId, courseId) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw ApiError.notFound('Course not found');

    const amount = course.price * 100; // Convert to smallest currency unit (paise)

    const order = await this.gateway.createOrder({
      amount,
      currency: 'INR',
      receipt: `receipt_order_${courseId}_${userId}`,
    });

    // Create pending enrollment
    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        razorpayOrderId: order.orderId,
        paymentStatus: 'PENDING',
      },
    });

    return order;
  }

  async verifyPayment(data) {
    const isAuthentic = await this.gateway.verifyPayment(data);

    const orderId = data.razorpay_order_id;

    if (isAuthentic) {
      await prisma.enrollment.updateMany({
        where: { razorpayOrderId: orderId },
        data: { paymentStatus: 'SUCCESS' },
      });
      return true;
    } else {
      await prisma.enrollment.updateMany({
        where: { razorpayOrderId: orderId },
        data: { paymentStatus: 'FAILED' },
      });
      throw ApiError.paymentError('Payment verification failed');
    }
  }
}

module.exports = new PaymentService();
