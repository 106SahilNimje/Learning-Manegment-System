const API_BASE = 'http://localhost:5000/api/v1';

/**
 * Generic fetch wrapper with auth token support.
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export const resellerApi = {
  // ─── Admin endpoints ──────────────────────────────
  getOrganizations: () => apiFetch('/reseller/admin/organizations'),
  getOrganization: (id) => apiFetch(`/reseller/admin/organizations/${id}`),
  createOrganization: (data) => apiFetch('/reseller/admin/organizations', { method: 'POST', body: JSON.stringify(data) }),
  updateOrganization: (id, data) => apiFetch(`/reseller/admin/organizations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleOrganization: (id) => apiFetch(`/reseller/admin/organizations/${id}/toggle`, { method: 'PATCH' }),
  getAllOrders: () => apiFetch('/reseller/admin/orders'),
  getCommissionReport: () => apiFetch('/reseller/admin/reports/commissions'),

  // ─── Reseller endpoints ───────────────────────────
  getMyOrg: () => apiFetch('/reseller/my/organization'),
  updateMyOrg: (data) => apiFetch('/reseller/my/organization', { method: 'PUT', body: JSON.stringify(data) }),
  getMyDashboard: () => apiFetch('/reseller/my/dashboard'),
  getMyCatalog: () => apiFetch('/reseller/my/catalog'),
  getAvailableCourses: () => apiFetch('/reseller/my/catalog/available'),
  addToCatalog: (data) => apiFetch('/reseller/my/catalog', { method: 'POST', body: JSON.stringify(data) }),
  updateCatalogItem: (id, data) => apiFetch(`/reseller/my/catalog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  removeCatalogItem: (id) => apiFetch(`/reseller/my/catalog/${id}`, { method: 'DELETE' }),
  getMyStudents: () => apiFetch('/reseller/my/students'),
  addStudent: (data) => apiFetch('/reseller/my/students', { method: 'POST', body: JSON.stringify(data) }),
  getMyOrders: () => apiFetch('/reseller/my/orders'),
  getMyWallet: () => apiFetch('/reseller/my/wallet'),
  getMyLedger: () => apiFetch('/reseller/my/wallet/ledger'),

  // ─── Public storefront ────────────────────────────
  getStorefront: (slug) => apiFetch(`/reseller/storefront/${slug}`),
  createStorefrontOrder: (slug, data) => apiFetch(`/reseller/storefront/${slug}/order`, { method: 'POST', body: JSON.stringify(data) }),
  verifyStorefrontPayment: (data) => apiFetch('/reseller/storefront/verify-payment', { method: 'POST', body: JSON.stringify(data) }),
};

export default resellerApi;
