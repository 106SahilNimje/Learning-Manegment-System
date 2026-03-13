const courseService = require('./course.service');
const ApiResponse = require('../../utils/ApiResponse');
const { parsePaginationParams } = require('../../utils/pagination');

class CourseController {
  async getAllCourses(req, res, next) {
    try {
      const paginationOpts = parsePaginationParams(req.query);
      const filters = {
        status: req.query.status,
        category: req.query.category,
        tenantId: req.tenantId || null,
      };
      const { courses, total } = await courseService.getAllCourses(paginationOpts, filters);
      return ApiResponse.paginated(res, {
        data: courses,
        page: paginationOpts.page,
        limit: paginationOpts.limit,
        total,
      });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
        errorCode: error.errorCode || 'INTERNAL_ERROR',
      });
    }
  }

  async getCourseById(req, res, next) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      return ApiResponse.success(res, { data: course });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 404,
        errorCode: error.errorCode || 'NOT_FOUND',
      });
    }
  }

  async createCourse(req, res, next) {
    try {
      const course = await courseService.createCourse(req.body, req.user.id, req.tenantId);
      return ApiResponse.created(res, { data: course });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
      });
    }
  }

  async updateCourse(req, res, next) {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body, req.user);
      return ApiResponse.success(res, { data: course, message: 'Course updated successfully' });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
      });
    }
  }

  async deleteCourse(req, res, next) {
    try {
      await courseService.deleteCourse(req.params.id, req.user);
      return ApiResponse.success(res, { message: 'Course deleted successfully' });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
      });
    }
  }

  async togglePublish(req, res, next) {
    try {
      const course = await courseService.togglePublish(req.params.id, req.user);
      return ApiResponse.success(res, {
        data: course,
        message: `Course ${course.status === 'PUBLISHED' ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
      });
    }
  }

  async addModule(req, res, next) {
    try {
      const module = await courseService.addModule(req.params.id, req.body);
      return ApiResponse.created(res, { data: module });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
      });
    }
  }

  async addLesson(req, res, next) {
    try {
      const lesson = await courseService.addLesson(req.params.moduleId, req.body);
      return ApiResponse.created(res, { data: lesson });
    } catch (error) {
      return ApiResponse.error(res, {
        message: error.message,
        statusCode: error.statusCode || 400,
      });
    }
  }
}

module.exports = new CourseController();
