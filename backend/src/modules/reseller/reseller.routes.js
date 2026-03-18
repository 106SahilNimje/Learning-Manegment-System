const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middlewares/auth.middleware');

const orgController = require('./organization.controller');
const catalogController = require('./catalog.controller');
const orderController = require('./order.controller');
const walletController = require('./wallet.controller');

// ═══════════════════════════════════════════════════════════
//  PUBLIC ROUTES (Student / Storefront)
// ═══════════════════════════════════════════════════════════

// Public storefront catalog by reseller slug
router.get('/storefront/:slug', catalogController.getPublicCatalog);

// Student purchase flow (public)
router.post('/storefront/:slug/order', orderController.createOrder);
router.post('/storefront/verify-payment', orderController.verifyPayment);

// ═══════════════════════════════════════════════════════════
//  RESELLER ADMIN ROUTES (Authenticated Reseller)
// ═══════════════════════════════════════════════════════════

router.use('/my', protect, authorize('RESELLER_ADMIN'));

// Organization management
router.get('/my/organization', orgController.getMyOrg);
router.put('/my/organization', orgController.updateMyOrg);
router.get('/my/dashboard', orgController.getMyDashboard);

// Catalog management
router.get('/my/catalog', catalogController.getMyCatalog);
router.get('/my/catalog/available', catalogController.getAvailableCourses);
router.post('/my/catalog', catalogController.addToCatalog);
router.put('/my/catalog/:id', catalogController.updateCatalogItem);
router.delete('/my/catalog/:id', catalogController.removeFromCatalog);

// Student management
router.get('/my/students', orgController.getMyStudents);
router.post('/my/students', orgController.addStudent);

// Orders
router.get('/my/orders', orderController.getMyOrders);

// Wallet / Commission
router.get('/my/wallet', walletController.getMyWallet);
router.get('/my/wallet/ledger', walletController.getMyLedger);

// ═══════════════════════════════════════════════════════════
//  PLATFORM ADMIN ROUTES
// ═══════════════════════════════════════════════════════════

router.use('/admin', protect, authorize('ADMIN', 'PLATFORM_OWNER'));

// Organization CRUD
router.get('/admin/organizations', orgController.getAll);
router.get('/admin/organizations/:id', orgController.getById);
router.post('/admin/organizations', orgController.create);
router.put('/admin/organizations/:id', orgController.update);
router.patch('/admin/organizations/:id/toggle', orgController.toggleActive);

// All orders
router.get('/admin/orders', orderController.getAllOrders);

// Platform commission report
router.get('/admin/reports/commissions', walletController.getPlatformReport);

module.exports = router;
