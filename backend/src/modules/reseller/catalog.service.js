const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

class CatalogService {
  /**
   * Get all LMS courses available for catalog mapping.
   */
  async getAvailableCourses() {
    return await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, description: true, price: true, thumbnail: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Map courses to a reseller's catalog.
   */
  async addToCatalog(organizationId, data) {
    const { courseId, customTitle, customPrice } = data;

    // Validate course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw ApiError.notFound('Course not found in LMS');

    // Check if already mapped
    const existing = await prisma.catalogMapping.findUnique({
      where: { organizationId_courseId: { organizationId, courseId } },
    });
    if (existing) throw ApiError.conflict('Course already in your catalog');

    return await prisma.catalogMapping.create({
      data: {
        organizationId,
        courseId,
        customTitle: customTitle || course.title,
        customPrice: customPrice !== undefined ? customPrice : course.price,
      },
    });
  }

  /**
   * Get reseller's catalog with course details.
   */
  async getCatalog(organizationId) {
    return await prisma.catalogMapping.findMany({
      where: { organizationId },
      include: {
        course: {
          select: { id: true, title: true, description: true, price: true, thumbnail: true, category: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get active catalog for a reseller's storefront (public).
   */
  async getPublicCatalog(organizationSlug) {
    const org = await prisma.organization.findUnique({ where: { slug: organizationSlug } });
    if (!org || !org.isActive) throw ApiError.notFound('Storefront not found');

    const catalog = await prisma.catalogMapping.findMany({
      where: { organizationId: org.id, isActive: true },
      include: {
        course: {
          select: { id: true, title: true, description: true, thumbnail: true, category: true },
        },
      },
    });

    return {
      organization: { id: org.id, name: org.name, slug: org.slug, logoUrl: org.logoUrl, brandColor: org.brandColor, description: org.description },
      courses: catalog.map((item) => ({
        catalogId: item.id,
        courseId: item.courseId,
        title: item.customTitle || item.course.title,
        description: item.course.description,
        price: item.customPrice !== null ? item.customPrice : item.course.price,
        thumbnail: item.course.thumbnail,
        category: item.course.category,
      })),
    };
  }

  /**
   * Update a catalog mapping (price, title, active status).
   */
  async updateCatalogItem(mappingId, organizationId, data) {
    const mapping = await prisma.catalogMapping.findFirst({
      where: { id: mappingId, organizationId },
    });
    if (!mapping) throw ApiError.notFound('Catalog item not found');

    const updateData = {};
    if (data.customTitle !== undefined) updateData.customTitle = data.customTitle;
    if (data.customPrice !== undefined) updateData.customPrice = data.customPrice;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return await prisma.catalogMapping.update({ where: { id: mappingId }, data: updateData });
  }

  /**
   * Remove a course from reseller's catalog.
   */
  async removeFromCatalog(mappingId, organizationId) {
    const mapping = await prisma.catalogMapping.findFirst({
      where: { id: mappingId, organizationId },
    });
    if (!mapping) throw ApiError.notFound('Catalog item not found');
    return await prisma.catalogMapping.delete({ where: { id: mappingId } });
  }
}

module.exports = new CatalogService();
