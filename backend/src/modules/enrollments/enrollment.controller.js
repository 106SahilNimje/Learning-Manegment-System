const enrollmentService = require('./enrollment.service');
const ApiResponse = require('../../utils/ApiResponse');
const { parsePaginationParams } = require('../../utils/pagination');

class EnrollmentController {
  async getMyEnrollments(req, res, next) {
    try {
      const enrollments = await enrollmentService.getMyEnrollments(req.user.id);
      return ApiResponse.success(res, { data: enrollments });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
      });
    }
  }

  async markLessonCompleted(req, res, next) {
    try {
      const { enrollmentId, lessonId } = req.body;
      const progress = await enrollmentService.markLessonCompleted(enrollmentId, lessonId);
      return ApiResponse.success(res, { data: progress, message: 'Lesson marked as completed' });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
      });
    }
  }

  async getAllEnrollments(req, res, next) {
    try {
      const paginationOpts = parsePaginationParams(req.query);
      const { enrollments, total } = await enrollmentService.getAllEnrollments(paginationOpts, req.tenantId);
      return ApiResponse.paginated(res, {
        data: enrollments,
        page: paginationOpts.page,
        limit: paginationOpts.limit,
        total,
      });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
      });
    }
  }
}

module.exports = new EnrollmentController();
