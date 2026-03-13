const prisma = require('../../config/prisma');

class AdminService {
  /**
   * Get dashboard statistics — optionally scoped to a tenant.
   */
  async getDashboardStats(tenantId = null) {
    const userWhere = tenantId ? { tenantId } : {};
    const courseWhere = tenantId ? { tenantId } : {};
    const enrollmentWhere = tenantId ? { course: { tenantId } } : {};

    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      recentEnrollments,
      coursesByStatus,
      usersByRole,
    ] = await Promise.all([
      // Total users
      prisma.user.count({ where: userWhere }),

      // Total courses
      prisma.course.count({ where: courseWhere }),

      // Total successful enrollments
      prisma.enrollment.count({
        where: { ...enrollmentWhere, paymentStatus: 'SUCCESS' },
      }),

      // Total revenue (sum of course prices for successful enrollments)
      prisma.enrollment.findMany({
        where: { ...enrollmentWhere, paymentStatus: 'SUCCESS' },
        include: { course: { select: { price: true } } },
      }).then((enrollments) =>
        enrollments.reduce((sum, e) => sum + (e.course?.price || 0), 0)
      ),

      // Recent 5 enrollments
      prisma.enrollment.findMany({
        where: enrollmentWhere,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true, price: true } },
        },
      }),

      // Courses grouped by status
      prisma.course.groupBy({
        by: ['status'],
        where: courseWhere,
        _count: { id: true },
      }),

      // Users grouped by role
      prisma.user.groupBy({
        by: ['role'],
        where: userWhere,
        _count: { id: true },
      }),
    ]);

    return {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      recentEnrollments,
      coursesByStatus: coursesByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {}),
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.id;
        return acc;
      }, {}),
    };
  }
}

module.exports = new AdminService();
