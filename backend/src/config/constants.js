// ─── API Configuration ──────────────────────────────────
const API_VERSION = 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

// ─── Pagination Defaults ────────────────────────────────
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// ─── Error Codes ────────────────────────────────────────
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  TENANT_INACTIVE: 'TENANT_INACTIVE',
};

// ─── Roles ──────────────────────────────────────────────
const ROLES = {
  STUDENT: 'STUDENT',
  INSTRUCTOR: 'INSTRUCTOR',
  ADMIN: 'ADMIN',
};

// ─── Course Status ──────────────────────────────────────
const COURSE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

module.exports = {
  API_VERSION,
  API_PREFIX,
  PAGINATION,
  ERROR_CODES,
  ROLES,
  COURSE_STATUS,
};
