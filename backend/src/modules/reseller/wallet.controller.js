const walletService = require('./wallet.service');
const organizationService = require('./organization.service');
const ApiResponse = require('../../utils/ApiResponse');

class WalletController {
  /**
   * Get wallet summary (Reseller).
   */
  async getMyWallet(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      const wallet = await walletService.getWalletSummary(org.id);
      return ApiResponse.success(res, { data: wallet });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  /**
   * Get detailed wallet ledger (Reseller).
   */
  async getMyLedger(req, res) {
    try {
      const org = await organizationService.getOrganizationByOwnerId(req.user.id);
      const ledger = await walletService.getWalletLedger(org.id);
      return ApiResponse.success(res, { data: ledger });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  /**
   * Get platform-wide commission report (Admin).
   */
  async getPlatformReport(req, res) {
    try {
      const report = await walletService.getPlatformReport();
      return ApiResponse.success(res, { data: report });
    } catch (error) {
      return ApiResponse.error(res, { message: error.message, statusCode: error.statusCode || 500 });
    }
  }
}

module.exports = new WalletController();
