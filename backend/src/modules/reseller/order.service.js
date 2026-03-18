const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');
const ApiError = require('../../utils/ApiError');
const RazorpayGateway = require('../payments/gateways/RazorpayGateway');

class ResellerOrderService {
  constructor() {
    this.gateway = new RazorpayGateway();
  }

  /**
   * Create a purchase order for a student buying from a reseller.
   * Steps:
   *   1. Validate catalog mapping
   *   2. Ensure/create student in LMS
   *   3. Create Razorpay order
   *   4. Create ResellerOrder record
   */
  async createOrder(organizationSlug, data) {
    const { catalogId, studentName, studentEmail, studentPassword } = data;

    // 1. Find the organization
    const org = await prisma.organization.findUnique({ where: { slug: organizationSlug } });
    if (!org || !org.isActive) throw ApiError.notFound('Storefront not active');

    // 2. Find the catalog mapping
    const mapping = await prisma.catalogMapping.findFirst({
      where: { id: catalogId, organizationId: org.id, isActive: true },
      include: { course: true },
    });
    if (!mapping) throw ApiError.notFound('Course not found in this catalog');

    const price = mapping.customPrice !== null ? mapping.customPrice : mapping.course.price;

    // 3. Ensure student exists in Users table (for LMS enrollment later)
    let student = await prisma.user.findFirst({ where: { email: studentEmail } });
    if (!student) {
      const hashedPassword = await bcrypt.hash(studentPassword || 'student@123', 10);
      student = await prisma.user.create({
        data: { name: studentName, email: studentEmail, password: hashedPassword, role: 'STUDENT' },
      });
    }

    // 4. Register as reseller student
    await prisma.resellerStudent.upsert({
      where: { organizationId_studentEmail: { organizationId: org.id, studentEmail } },
      update: { lmsUserId: student.id },
      create: { organizationId: org.id, studentEmail, studentName, lmsUserId: student.id },
    });

    // 5. Create Razorpay order
    const amount = price * 100; // paise
    const pgOrder = await this.gateway.createOrder({
      amount,
      currency: 'INR',
      receipt: `reseller_order_${org.slug}_${mapping.courseId}_${student.id}`,
    });

    // 6. Calculate commission split
    const platformFee = (price * org.commissionRate) / 100;
    const gstAmount = (platformFee * 18) / 100; // 18% GST on platform fee
    const resellerEarnings = price - platformFee - gstAmount;

    // 7. Create ResellerOrder
    const order = await prisma.resellerOrder.create({
      data: {
        organizationId: org.id,
        studentId: student.id,
        catalogMappingId: mapping.id,
        amountPaid: price,
        platformFee,
        resellerEarnings,
        gstAmount,
        status: 'PENDING',
        razorpayOrderId: pgOrder.orderId,
      },
    });

    return {
      orderId: order.id,
      razorpayOrderId: pgOrder.orderId,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: pgOrder.amount,
      currency: pgOrder.currency,
      courseName: mapping.customTitle || mapping.course.title,
      studentEmail,
    };
  }

  /**
   * Verify payment and auto-enroll student into LMS.
   */
  async verifyPayment(data) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    // Verify signature
    const isAuthentic = await this.gateway.verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

    const order = await prisma.resellerOrder.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
      include: { catalogMapping: { include: { course: true } }, organization: true },
    });
    if (!order) throw ApiError.notFound('Order not found');

    if (isAuthentic) {
      // Update order status
      await prisma.resellerOrder.update({
        where: { id: order.id },
        data: { status: 'SUCCESS', pgTransactionId: razorpay_payment_id },
      });

      // Create wallet ledger entry (Auto Split Payment)
      await prisma.walletLedger.create({
        data: {
          organizationId: order.organizationId,
          orderId: order.id,
          grossAmount: order.amountPaid,
          platformFee: order.platformFee,
          gstAmount: order.gstAmount,
          netResellerEarnings: order.resellerEarnings,
          description: `Sale: ${order.catalogMapping.customTitle || order.catalogMapping.course.title}`,
        },
      });

      // Auto Enroll Student into LMS
      const courseId = order.catalogMapping.courseId;
      const studentId = order.studentId;

      // Check if already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: studentId, courseId } },
      });

      if (!existingEnrollment) {
        await prisma.enrollment.create({
          data: {
            userId: studentId,
            courseId,
            razorpayOrderId: razorpay_order_id,
            paymentStatus: 'SUCCESS',
            resellerOrderId: order.id,
          },
        });
      }

      // Generate invoice number
      const invoiceNumber = `INV-${order.organization.slug.toUpperCase()}-${Date.now()}`;
      await prisma.resellerOrder.update({
        where: { id: order.id },
        data: { invoiceNumber },
      });

      return { success: true, message: 'Payment verified, student enrolled', invoiceNumber };
    } else {
      await prisma.resellerOrder.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });
      throw ApiError.paymentError('Payment verification failed');
    }
  }

  /**
   * Get orders for a reseller organization.
   */
  async getOrganizationOrders(organizationId) {
    return await prisma.resellerOrder.findMany({
      where: { organizationId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        catalogMapping: {
          include: { course: { select: { title: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all orders (Platform Admin).
   */
  async getAllOrders() {
    return await prisma.resellerOrder.findMany({
      include: {
        organization: { select: { id: true, name: true, slug: true } },
        student: { select: { id: true, name: true, email: true } },
        catalogMapping: { include: { course: { select: { title: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new ResellerOrderService();
