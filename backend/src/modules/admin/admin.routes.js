const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// All admin routes require ADMIN role or API key auth
router.use(protect, authorize('ADMIN'));

router.get('/stats', adminController.getDashboardStats);

module.exports = router;
