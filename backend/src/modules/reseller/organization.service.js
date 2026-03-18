const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');
const ApiError = require('../../utils/ApiError');

class OrganizationService {
  /**
   * Create a new reseller organization (called by Platform Owner / Admin).
   */
  async createOrganization(data) {
    const { name, ownerName, ownerEmail, ownerPassword, commissionRate, contactEmail, contactPhone, gstNumber, description } = data;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check uniqueness
    const existing = await prisma.organization.findFirst({
      where: { OR: [{ name }, { slug }] },
    });
    if (existing) throw ApiError.conflict('Organization with this name already exists');

    // Check if owner email is already taken
    const existingUser = await prisma.user.findFirst({ where: { email: ownerEmail } });
    if (existingUser) throw ApiError.conflict('A user with this email already exists');

    // Create owner user + organization in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const hashedPassword = await bcrypt.hash(ownerPassword, 10);
      const owner = await tx.user.create({
        data: {
          name: ownerName,
          email: ownerEmail,
          password: hashedPassword,
          role: 'RESELLER_ADMIN',
        },
      });

      const organization = await tx.organization.create({
        data: {
          name,
          slug,
          ownerId: owner.id,
          commissionRate: commissionRate || 20.0,
          contactEmail: contactEmail || ownerEmail,
          contactPhone,
          gstNumber,
          description,
        },
      });

      return { organization, owner: { id: owner.id, name: owner.name, email: owner.email, role: owner.role } };
    });

    return result;
  }

  /**
   * Get all organizations with stats.
   */
  async getAllOrganizations() {
    return await prisma.organization.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { catalogMappings: true, orders: true, students: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get organization by ID with full details.
   */
  async getOrganizationById(id) {
    const org = await prisma.organization.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { catalogMappings: true, orders: true, students: true, walletLedger: true } },
      },
    });
    if (!org) throw ApiError.notFound('Organization not found');
    return org;
  }

  /**
   * Get organization by owner's user ID.
   */
  async getOrganizationByOwnerId(ownerId) {
    const org = await prisma.organization.findUnique({
      where: { ownerId },
      include: {
        _count: { select: { catalogMappings: true, orders: true, students: true, walletLedger: true } },
      },
    });
    if (!org) throw ApiError.notFound('No organization linked to this user');
    return org;
  }

  /**
   * Update organization (branding, settings, commission rate).
   */
  async updateOrganization(id, data) {
    const org = await prisma.organization.findUnique({ where: { id } });
    if (!org) throw ApiError.notFound('Organization not found');

    const updateData = {};
    const allowedFields = ['name', 'customDomain', 'logoUrl', 'brandColor', 'description', 'contactEmail', 'contactPhone', 'gstNumber', 'commissionRate', 'isActive', 'subscriptionStatus', 'subscriptionExpiry'];
    for (const field of allowedFields) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }

    return await prisma.organization.update({ where: { id }, data: updateData });
  }

  /**
   * Toggle organization active status.
   */
  async toggleActive(id) {
    const org = await prisma.organization.findUnique({ where: { id } });
    if (!org) throw ApiError.notFound('Organization not found');
    return await prisma.organization.update({
      where: { id },
      data: { isActive: !org.isActive },
    });
  }

  /**
   * Get reseller's students.
   */
  async getStudents(organizationId) {
    return await prisma.resellerStudent.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Add a student to reseller's student list.
   */
  async addStudent(organizationId, data) {
    const { studentEmail, studentName } = data;
    return await prisma.resellerStudent.create({
      data: { organizationId, studentEmail, studentName },
    });
  }

  /**
   * Get organization dashboard stats.
   */
  async getDashboardStats(organizationId) {
    const [totalStudents, totalCourses, totalOrders, walletEntries] = await Promise.all([
      prisma.resellerStudent.count({ where: { organizationId } }),
      prisma.catalogMapping.count({ where: { organizationId, isActive: true } }),
      prisma.resellerOrder.count({ where: { organizationId, status: 'SUCCESS' } }),
      prisma.walletLedger.findMany({
        where: { organizationId },
        select: { grossAmount: true, platformFee: true, netResellerEarnings: true },
      }),
    ]);

    const totalRevenue = walletEntries.reduce((sum, e) => sum + e.grossAmount, 0);
    const totalEarnings = walletEntries.reduce((sum, e) => sum + e.netResellerEarnings, 0);
    const totalPlatformFee = walletEntries.reduce((sum, e) => sum + e.platformFee, 0);

    return { totalStudents, totalCourses, totalOrders, totalRevenue, totalEarnings, totalPlatformFee };
  }
}

module.exports = new OrganizationService();
