const express = require('express');
const router = express.Router();
const tenantController = require('./tenant.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// All tenant routes require ADMIN role
router.use(protect, authorize('ADMIN'));

router.get('/', tenantController.getAllTenants);
router.post('/', tenantController.createTenant);
router.get('/:id', tenantController.getTenantById);
router.put('/:id', tenantController.updateTenant);
router.post('/:id/api-keys', tenantController.generateApiKey);
router.get('/:id/api-keys', tenantController.getApiKeys);
router.delete('/api-keys/:keyId', tenantController.revokeApiKey);

module.exports = router;
