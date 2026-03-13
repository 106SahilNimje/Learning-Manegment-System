const Razorpay = require('razorpay');
const crypto = require('crypto');
const PaymentGateway = require('./PaymentGateway');

/**
 * Razorpay adapter implementing the abstract PaymentGateway interface.
 */
class RazorpayGateway extends PaymentGateway {
  constructor() {
    super();
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder({ amount, currency = 'INR', receipt, notes = {} }) {
    const options = {
      amount, // in smallest currency unit (paise for INR)
      currency,
      receipt,
      notes,
    };

    const order = await this.razorpay.orders.create(options);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      providerData: order,
    };
  }

  async verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpay_signature;
  }
}

module.exports = RazorpayGateway;
