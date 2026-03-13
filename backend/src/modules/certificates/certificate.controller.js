const certificateService = require('./certificate.service');
const ApiResponse = require('../../utils/ApiResponse');

class CertificateController {
  async generate(req, res, next) {
    try {
      const { courseId } = req.params;
      const cert = await certificateService.generateCertificate(req.user.id, courseId);
      return ApiResponse.created(res, { data: cert });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
      });
    }
  }

  async getMyCertificates(req, res, next) {
    try {
      const certs = await certificateService.getMyCertificates(req.user.id);
      return ApiResponse.success(res, { data: certs });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
      });
    }
  }
}

module.exports = new CertificateController();
