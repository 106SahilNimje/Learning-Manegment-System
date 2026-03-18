const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

class WalletService {
  /**
   * Get wallet summary for a reseller.
   */
  async getWalletSummary(organizationId) {
    const entries = await prisma.walletLedger.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });

    const totalGross = entries.reduce((sum, e) => sum + e.grossAmount, 0);
    const totalPlatformFee = entries.reduce((sum, e) => sum + e.platformFee, 0);
    const totalGst = entries.reduce((sum, e) => sum + e.gstAmount, 0);
    const totalNet = entries.reduce((sum, e) => sum + e.netResellerEarnings, 0);

    return {
      summary: { totalGross, totalPlatformFee, totalGst, totalNet, totalTransactions: entries.length },
      recentTransactions: entries.slice(0, 20),
    };
  }

  /**
   * Get full wallet ledger (all entries).
   */
  async getWalletLedger(organizationId) {
    return await prisma.walletLedger.findMany({
      where: { organizationId },
      include: {
        order: {
          include: {
            student: { select: { name: true, email: true } },
            catalogMapping: { include: { course: { select: { title: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get platform-wide commission report (Admin).
   */
  async getPlatformReport() {
    const allEntries = await prisma.walletLedger.findMany({
      include: {
        organization: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate by organization
    const orgMap = {};
    for (const entry of allEntries) {
      const orgId = entry.organizationId;
      if (!orgMap[orgId]) {
        orgMap[orgId] = {
          organization: entry.organization,
          totalGross: 0,
          totalPlatformFee: 0,
          totalGst: 0,
          totalNet: 0,
          transactionCount: 0,
        };
      }
      orgMap[orgId].totalGross += entry.grossAmount;
      orgMap[orgId].totalPlatformFee += entry.platformFee;
      orgMap[orgId].totalGst += entry.gstAmount;
      orgMap[orgId].totalNet += entry.netResellerEarnings;
      orgMap[orgId].transactionCount++;
    }

    const platformTotals = {
      totalGross: allEntries.reduce((s, e) => s + e.grossAmount, 0),
      totalPlatformEarnings: allEntries.reduce((s, e) => s + e.platformFee, 0),
      totalGst: allEntries.reduce((s, e) => s + e.gstAmount, 0),
      totalResellerPayouts: allEntries.reduce((s, e) => s + e.netResellerEarnings, 0),
    };

    return { platformTotals, byOrganization: Object.values(orgMap) };
  }
}

module.exports = new WalletService();
