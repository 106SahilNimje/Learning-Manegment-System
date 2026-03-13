const express = require('express');
const router = express.Router();
const enrollmentController = require('./enrollment.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// Student routes
router.get('/my-courses', protect, enrollmentController.getMyEnrollments);
router.post('/progress', protect, enrollmentController.markLessonCompleted);

// Admin routes
router.get('/', protect, authorize('ADMIN'), enrollmentController.getAllEnrollments);

module.exports = router;
