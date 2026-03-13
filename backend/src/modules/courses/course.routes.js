const express = require('express');
const router = express.Router();
const courseController = require('./course.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Instructor / Admin routes
router.post('/', protect, authorize('INSTRUCTOR', 'ADMIN'), courseController.createCourse);
router.put('/:id', protect, authorize('INSTRUCTOR', 'ADMIN'), courseController.updateCourse);
router.delete('/:id', protect, authorize('INSTRUCTOR', 'ADMIN'), courseController.deleteCourse);
router.patch('/:id/publish', protect, authorize('INSTRUCTOR', 'ADMIN'), courseController.togglePublish);

// Module & Lesson management
router.post('/:id/modules', protect, authorize('INSTRUCTOR', 'ADMIN'), courseController.addModule);
router.post('/modules/:moduleId/lessons', protect, authorize('INSTRUCTOR', 'ADMIN'), upload.single('file'), courseController.addLesson);

module.exports = router;
