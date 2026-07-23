/**
 * @file api.js
 * @description Centralized API client for LuxeCart backend.
 * All requests go through /api/v1 (proxied to http://localhost:5000 in development).
 *
 * Features:
 *   - Automatic JWT access token injection from localStorage
 *   - Auth header attached to every request
 *   - Consistent error handling — throws structured errors
 */

const API_BASE = '/api/v1';

// ── Token management ──────────────────────────────────────────────────────────

export function getAccessToken() {
  return localStorage.getItem('luxecart_access_token');
}

export function setAccessToken(token) {
  if (token) localStorage.setItem('luxecart_access_token', token);
  else localStorage.removeItem('luxecart_access_token');
}

export function setRefreshToken(token) {
  if (token) localStorage.setItem('luxecart_refresh_token', token);
  else localStorage.removeItem('luxecart_refresh_token');
}

export function getRefreshToken() {
  return localStorage.getItem('luxecart_refresh_token');
}

export function clearTokens() {
  localStorage.removeItem('luxecart_access_token');
  localStorage.removeItem('luxecart_refresh_token');
}

// ── HTTP client ───────────────────────────────────────────────────────────────

/**
 * Core fetch wrapper. Attaches auth token, JSON headers, handles error parsing.
 */
async function apiFetch(path, options = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for refresh tokens
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export async function register(name, email, password, confirmPassword) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });
}

export async function login(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.data?.tokens) {
    setAccessToken(data.data.tokens.accessToken);
    setRefreshToken(data.data.tokens.refreshToken);
  }
  return data;
}

export async function logout() {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    clearTokens();
  }
}

export async function getMe() {
  return apiFetch('/auth/me');
}

export async function refreshTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const data = await apiFetch('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (data?.data?.accessToken) {
    setAccessToken(data.data.accessToken);
  }
  return data;
}

// ── Products API ──────────────────────────────────────────────────────────────

export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  return apiFetch(`/products?${params.toString()}`);
}

export async function fetchProductBySlug(slug) {
  return apiFetch(`/products/${slug}`);
}

export async function fetchProductById(id) {
  return apiFetch(`/products/${id}`);
}

export async function fetchCategories() {
  return apiFetch('/categories');
}

export async function fetchBrands() {
  return apiFetch('/brands');
}

// ── Cart API ──────────────────────────────────────────────────────────────────

export async function fetchCart() {
  return apiFetch('/cart');
}

export async function addItemToCart(productId, quantity = 1, variantId = null) {
  return apiFetch('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity, ...(variantId && { variantId }) }),
  });
}

export async function updateCartItemQty(itemId, quantity) {
  return apiFetch(`/cart/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCartApi(itemId) {
  return apiFetch(`/cart/${itemId}`, { method: 'DELETE' });
}

export async function clearCartApi() {
  return apiFetch('/cart', { method: 'DELETE' });
}

// ── Addresses API ─────────────────────────────────────────────────────────────

export async function fetchAddresses() {
  return apiFetch('/addresses');
}

export async function createAddress(addressData) {
  return apiFetch('/addresses', {
    method: 'POST',
    body: JSON.stringify(addressData),
  });
}

export async function updateAddress(id, addressData) {
  return apiFetch(`/addresses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(addressData),
  });
}

export async function deleteAddress(id) {
  return apiFetch(`/addresses/${id}`, { method: 'DELETE' });
}

// ── Orders API ────────────────────────────────────────────────────────────────

export async function submitOrder(orderData) {
  return apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export async function fetchOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/orders${query ? `?${query}` : ''}`);
}

export async function fetchOrderById(id) {
  return apiFetch(`/orders/${id}`);
}

// ── Coupons API ───────────────────────────────────────────────────────────────

export async function validateCoupon(code, subtotal) {
  return apiFetch('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal }),
  });
}

// ── Reviews API ───────────────────────────────────────────────────────────────

export async function fetchReviews(productId, page = 1) {
  return apiFetch(`/products/${productId}/reviews?page=${page}`);
}

export async function addReview(productId, reviewData) {
  return apiFetch(`/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ ...reviewData, productId }),
  });
}

// ── Admin API ─────────────────────────────────────────────────────────────────

export async function fetchAnalytics() {
  return apiFetch('/admin/analytics');
}

export async function createProduct(productData) {
  return apiFetch('/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(id, updates) {
  return apiFetch(`/admin/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteProduct(id) {
  return apiFetch(`/admin/products/${id}`, { method: 'DELETE' });
}

export async function updateOrderStatus(id, status, note) {
  return apiFetch(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  });
}

export async function fetchAdminOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/admin/orders${query ? `?${query}` : ''}`);
}

export async function fetchAdminUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/admin/users${query ? `?${query}` : ''}`);
}

export async function fetchAdminCoupons() {
  return apiFetch('/admin/coupons');
}

export async function createCoupon(couponData) {
  return apiFetch('/admin/coupons', {
    method: 'POST',
    body: JSON.stringify(couponData),
  });
}

export async function deleteCoupon(id) {
  return apiFetch(`/admin/coupons/${id}`, { method: 'DELETE' });
}

// ── AI Chat (placeholder — requires backend route) ───────────────────────────

export async function sendAIChat(message) {
  // Placeholder — AI chat endpoint not yet implemented in backend
  // Returns a mock response for now
  return {
    reply: `Thank you for your message! Our AI assistant is coming soon. You asked: "${message}"`,
  };
}
