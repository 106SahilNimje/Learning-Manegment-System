/**
 * Abstract Payment Gateway Interface.
 * All payment gateway adapters must implement these methods.
 *
 * This enables swapping payment providers (Razorpay, Stripe, etc.)
 * without touching the payment service logic.
 */
class PaymentGateway {
  /**
   * Create a payment order.
   * @param {Object} params - { amount, currency, receipt, notes }
   * @returns {Object} - { orderId, amount, currency, providerData }
   */
  async createOrder(params) {
    throw new Error('createOrder() must be implemented by the gateway adapter');
  }

  /**
   * Verify a payment signature/callback.
   * @param {Object} params - provider-specific verification data
   * @returns {boolean} - true if payment is authentic
   */
  async verifyPayment(params) {
    throw new Error('verifyPayment() must be implemented by the gateway adapter');
  }
}

module.exports = PaymentGateway;
