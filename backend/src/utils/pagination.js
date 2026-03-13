const { PAGINATION } = require('../config/constants');

/**
 * Parse pagination, sorting, and search query params
 * and return Prisma-compatible options.
 *
 * Supported query params:
 *   ?page=1&limit=20&sort=createdAt&order=desc&search=keyword
 */
function parsePaginationParams(query) {
  const page = Math.max(1, parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;

  // Sorting
  const sortField = query.sort || 'createdAt';
  const sortOrder = query.order === 'asc' ? 'asc' : 'desc';
  const orderBy = { [sortField]: sortOrder };

  // Search term (used by services for flexible filtering)
  const search = query.search || '';

  return { page, limit, skip, orderBy, search };
}

module.exports = { parsePaginationParams };
