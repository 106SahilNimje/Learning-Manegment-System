const catalogService = require('./catalog.service');
const organizationService = require('./organization.service');
const ApiResponse = require('../../utils/ApiResponse');

class CatalogController {
  /**
   * Get all LMS courses available for mapping (Reseller Admin).
   */
  async getAvailableCourses(req, res) {
    try {
      const courses = await catalogService.getAvailableCourses();
      return ApiResponse.success(res, { data: courses });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  /**
   * Add a course to reseller's catalog.
   */
  async addToCatalog(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      const mapping = await catalogService.addToCatalog(org.id, req.body);
      return ApiResponse.created(res, { data: mapping, message: 'Course added to catalog' });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  /**
   * Get reseller's entire catalog.
   */
  async getMyCatalog(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      const catalog = await catalogService.getCatalog(org.id);
      return ApiResponse.success(res, { data: catalog });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  /**
   * Public storefront — get catalog by reseller slug.
   */
  async getPublicCatalog(req, res) {
    try {
      const result = await catalogService.getPublicCatalog(req.params.slug);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 404 });
    }
  }

  /**
   * Update a catalog item.
   */
  async updateCatalogItem(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      const updated = await catalogService.updateCatalogItem(req.params.id, org.id, req.body);
      return ApiResponse.success(res, { data: updated, message: 'Catalog item updated' });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  /**
   * Remove a course from catalog.
   */
  async removeFromCatalog(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      await catalogService.removeFromCatalog(req.params.id, org.id);
      return ApiResponse.success(res, { message: 'Course removed from catalog' });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }
}

module.exports = new CatalogController();
