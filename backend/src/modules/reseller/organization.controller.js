const organizationService = require('./organization.service');
const ApiResponse = require('../../utils/ApiResponse');

class OrganizationController {
  // ─── Admin / Platform Owner Endpoints ─────────────────
  async create(req, res) {
    try {
      const result = await organizationService.createOrganization(req.body);
      return ApiResponse.created(res, { data: result, message: 'Reseller organization created successfully' });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400, errorCode: error.errorCode || 'VALIDATION_ERROR' });
    }
  }

  async getAll(req, res) {
    try {
      const organizations = await organizationService.getAllOrganizations();
      return ApiResponse.success(res, { data: organizations });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  async getById(req, res) {
    try {
      const org = await organizationService.getOrganizationById(req.params.id);
      return ApiResponse.success(res, { data: org });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 404 });
    }
  }

  async update(req, res) {
    try {
      const org = await organizationService.updateOrganization(req.params.id, req.body);
      return ApiResponse.success(res, { data: org, message: 'Organization updated' });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  async toggleActive(req, res) {
    try {
      const org = await organizationService.toggleActive(req.params.id);
      return ApiResponse.success(res, { data: org, message: `Organization ${org.isActive ? 'activated' : 'deactivated'}` });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  // ─── Reseller's Own Endpoints ─────────────────────────
  async getMyOrg(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      return ApiResponse.success(res, { data: org });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 404 });
    }
  }

  async updateMyOrg(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      const updated = await organizationService.updateOrganization(org.id, req.body);
      return ApiResponse.success(res, { data: updated, message: 'Organization updated' });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  async getMyStudents(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      const students = await organizationService.getStudents(org.id);
      return ApiResponse.success(res, { data: students });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  async addStudent(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      const student = await organizationService.addStudent(org.id, req.body);
      return ApiResponse.created(res, { data: student, message: 'Student added successfully' });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 400 });
    }
  }

  async getMyDashboard(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      const stats = await organizationService.getDashboardStats(org.id);
      return ApiResponse.success(res, { data: { organization: org, stats } });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 500 });
    }
  }
}

module.exports = new OrganizationController();
