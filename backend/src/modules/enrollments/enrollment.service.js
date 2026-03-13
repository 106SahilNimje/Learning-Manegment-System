const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

class EnrollmentService {
  async getMyEnrollments(userId) {
    return await prisma.enrollment.findMany({
      where: { userId, paymentStatus: 'SUCCESS' },
      include: {
        course: {
          include: { modules: { include: { lessons: true }, orderBy: { order: 'asc' } } },
        },
        progress: true,
      },
    });
  }

  async createEnrollment(userId, courseId, razorpayOrderId) {
    return await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        razorpayOrderId,
      },
    });
  }

  async markLessonCompleted(enrollmentId, lessonId) {
    return await prisma.progress.upsert({
      where: {
        enrollmentId_lessonId: { enrollmentId, lessonId },
      },
      update: {
        isCompleted: true,
      },
      create: {
        enrollmentId,
        lessonId,
        isCompleted: true,
      },
    });
  }

  /**
   * Admin: Get all enrollments with pagination and optional tenant filtering.
   */
  async getAllEnrollments(paginationOpts, tenantId = null) {
    const { skip, limit, orderBy } = paginationOpts;

    const where = {};

    // Tenant scoping: filter by courses that belong to a tenant
    if (tenantId) {
      where.course = { tenantId };
    }

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, title: true } },
        },
      }),
      prisma.enrollment.count({ where }),
    ]);

    return { enrollments, total };
  }
}

module.exports = new EnrollmentService();
