const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const { COURSE_STATUS } = require('../../config/constants');

class CourseService {
  /**
   * Get all courses with pagination, filtering, and search.
   */
  async getAllCourses(paginationOpts, filters = {}) {
    const { skip, limit, orderBy, search } = paginationOpts;

    const where = {};

    // Tenant scoping (optional — if no tenant, return all)
    if (filters.tenantId) {
      where.tenantId = filters.tenantId;
    }

    // Status filter
    if (filters.status) {
      where.status = filters.status;
    } else {
      // By default, only show published courses in public listings
      where.status = COURSE_STATUS.PUBLISHED;
    }

    // Category filter
    if (filters.category) {
      where.category = filters.category;
    }

    // Search (title or description)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          instructor: { select: { id: true, name: true } },
          modules: {
            include: { lessons: { select: { id: true, title: true, order: true } } },
            orderBy: { order: 'asc' },
          },
          _count: { select: { enrollments: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);

    return { courses, total };
  }

  /**
   * Get a single course by ID with full details.
   */
  async getCourseById(id) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, name: true } },
        modules: {
          include: { lessons: true },
          orderBy: { order: 'asc' },
        },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) throw ApiError.notFound('Course not found');
    return course;
  }

  /**
   * Create a new course.
   */
  async createCourse(data, instructorId, tenantId = null) {
    return await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        thumbnail: data.thumbnail,
        category: data.category || null,
        status: COURSE_STATUS.DRAFT,
        instructorId,
        tenantId,
      },
    });
  }

  /**
   * Update an existing course.
   */
  async updateCourse(id, data, user) {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) throw ApiError.notFound('Course not found');

    // Only the instructor or an admin can update
    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw ApiError.forbidden('You are not authorized to update this course');
    }

    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = parseFloat(data.price);
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
    if (data.category !== undefined) updateData.category = data.category;

    return await prisma.course.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete a course (cascade deletes modules & lessons via Prisma).
   */
  async deleteCourse(id, user) {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) throw ApiError.notFound('Course not found');

    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw ApiError.forbidden('You are not authorized to delete this course');
    }

    // Delete related enrollments first (no cascade set)
    await prisma.enrollment.deleteMany({ where: { courseId: id } });
    await prisma.course.delete({ where: { id } });
  }

  /**
   * Toggle course publish status (DRAFT ↔ PUBLISHED).
   */
  async togglePublish(id, user) {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) throw ApiError.notFound('Course not found');

    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw ApiError.forbidden('You are not authorized to modify this course');
    }

    const newStatus = course.status === COURSE_STATUS.PUBLISHED
      ? COURSE_STATUS.DRAFT
      : COURSE_STATUS.PUBLISHED;

    return await prisma.course.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  /**
   * Add a module to a course.
   */
  async addModule(courseId, data) {
    return await prisma.module.create({
      data: {
        title: data.title,
        order: data.order || 0,
        courseId,
      },
    });
  }

  /**
   * Add a lesson to a module.
   */
  async addLesson(moduleId, data) {
    return await prisma.lesson.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        pdfUrl: data.pdfUrl,
        order: data.order || 0,
        moduleId,
      },
    });
  }
}

module.exports = new CourseService();
