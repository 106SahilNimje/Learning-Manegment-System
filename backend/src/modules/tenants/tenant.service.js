const crypto = require('crypto');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

class TenantService {
  async getAllTenants() {
    return await prisma.tenant.findMany({
      include: {
        _count: { select: { users: true, courses: true, apiKeys: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTenantById(id) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true, courses: true, apiKeys: true } },
      },
    });
    if (!tenant) throw ApiError.notFound('Tenant not found');
    return tenant;
  }

  async createTenant(data) {
    const { name, slug, settings } = data;

    // Generate slug from name if not provided
    const resolvedSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check uniqueness
    const existing = await prisma.tenant.findFirst({
      where: { OR: [{ name }, { slug: resolvedSlug }] },
    });
    if (existing) throw ApiError.conflict('Tenant with this name or slug already exists');

    return await prisma.tenant.create({
      data: {
        name,
        slug: resolvedSlug,
        settings: settings || {},
      },
    });
  }

  async updateTenant(id, data) {
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw ApiError.notFound('Tenant not found');

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.settings !== undefined) updateData.settings = data.settings;

    return await prisma.tenant.update({ where: { id }, data: updateData });
  }

  /**
   * Generate a cryptographically secure API key for a tenant.
   */
  async generateApiKey(tenantId, label = 'Default') {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw ApiError.notFound('Tenant not found');

    // Generate a secure random key prefixed with "lms_"
    const key = `lms_${crypto.randomBytes(32).toString('hex')}`;

    return await prisma.apiKey.create({
      data: {
        key,
        label,
        tenantId,
      },
    });
  }

  async getApiKeys(tenantId) {
    return await prisma.apiKey.findMany({
      where: { tenantId },
      select: {
        id: true,
        key: true,
        label: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeApiKey(keyId) {
    const key = await prisma.apiKey.findUnique({ where: { id: keyId } });
    if (!key) throw ApiError.notFound('API key not found');

    return await prisma.apiKey.update({
      where: { id: keyId },
      data: { isActive: false },
    });
  }
}

module.exports = new TenantService();
