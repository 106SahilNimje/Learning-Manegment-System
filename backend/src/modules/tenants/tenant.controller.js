const tenantService = require('./tenant.service');
const ApiResponse = require('../../utils/ApiResponse');

class TenantController {
  async getAllTenants(req, res) {
    try {
      const tenants = await tenantService.getAllTenants();
      return ApiResponse.success(res, { data: tenants });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  async getTenantById(req, res) {
    try {
      const tenant = await tenantService.getTenantById(req.params.id);
      return ApiResponse.success(res, { data: tenant });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 404 });
    }
  }

  async createTenant(req, res) {
    try {
      const tenant = await tenantService.createTenant(req.body);
      return ApiResponse.created(res, { data: tenant });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  async updateTenant(req, res) {
    try {
      const tenant = await tenantService.updateTenant(req.params.id, req.body);
      return ApiResponse.success(res, { data: tenant, message: 'Tenant updated successfully' });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  async generateApiKey(req, res) {
    try {
      const apiKey = await tenantService.generateApiKey(req.params.id, req.body.label);
      return ApiResponse.created(res, { data: apiKey, message: 'API key generated' });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  async getApiKeys(req, res) {
    try {
      const keys = await tenantService.getApiKeys(req.params.id);
      return ApiResponse.success(res, { data: keys });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  async revokeApiKey(req, res) {
    try {
      await tenantService.revokeApiKey(req.params.keyId);
      return ApiResponse.success(res, { message: 'API key revoked' });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }
}

module.exports = new TenantController();
