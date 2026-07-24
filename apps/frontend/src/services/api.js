/**
 * Centralized API client for NexCart E-Commerce Platform.
 * Proxied to http://localhost:5000 in Vite dev server.
 */

const API_BASE = '/api';

export function getAccessToken() {
  return localStorage.getItem('nexcart_access_token');
}

export function setAccessToken(token) {
  if (token) localStorage.setItem('nexcart_access_token', token);
  else localStorage.removeItem('nexcart_access_token');
}

export function clearTokens() {
  localStorage.removeItem('nexcart_access_token');
}

async function apiFetch(path, options = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = data?.error || data?.message || `Request failed with status ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    console.warn(`[NexCart API] ${path} fetch warning:`, err.message);
    throw err;
  }
}

// --- Auth ---
export async function register(name, email, password) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  if (data?.token) setAccessToken(data.token);
  return data;
}

export async function login(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.token) setAccessToken(data.token);
  return data;
}

export async function logout() {
  clearTokens();
}

export async function getMe() {
  return apiFetch('/auth/me');
}

export async function updateUserProfile(id, updates) {
  return apiFetch(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

// --- Products ---
export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '' && filters[key] !== 'all') {
      params.append(key, filters[key]);
    }
  });
  return apiFetch(`/products?${params.toString()}`);
}

export async function fetchProductById(id) {
  return apiFetch(`/products/${id}`);
}

export async function createProduct(productData) {
  return apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
}

export async function updateProduct(id, updates) {
  return apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${id}`, {
    method: 'DELETE'
  });
}

// --- Categories ---
export async function fetchCategories() {
  return apiFetch('/categories');
}

export async function createCategory(categoryData) {
  return apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  });
}

// --- Orders ---
export async function submitOrder(orderData) {
  return apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
}

export async function fetchOrders(email = '') {
  return apiFetch(`/orders${email ? `?email=${encodeURIComponent(email)}` : ''}`);
}

export async function fetchOrderById(id) {
  return apiFetch(`/orders/${id}`);
}

export async function updateOrderStatus(id, status, note = '') {
  return apiFetch(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, note })
  });
}

// --- Reviews ---
export async function addReview(productId, reviewData) {
  return apiFetch(`/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
}

// --- Coupons ---
export async function fetchCoupons() {
  return apiFetch('/coupons');
}

export async function validateCoupon(code, subtotal) {
  return apiFetch('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal })
  });
}

export async function createCoupon(couponData) {
  return apiFetch('/coupons', {
    method: 'POST',
    body: JSON.stringify(couponData)
  });
}

export async function deleteCoupon(code) {
  return apiFetch(`/coupons/${code}`, {
    method: 'DELETE'
  });
}

// --- Payments ---
export async function processPayment(paymentData) {
  return apiFetch('/payments/process', {
    method: 'POST',
    body: JSON.stringify(paymentData)
  });
}

// --- Admin Analytics & Users ---
export async function fetchAnalytics() {
  return apiFetch('/analytics');
}

export async function fetchUsers() {
  return apiFetch('/users');
}

// --- AI Concierge ---
export async function sendAIChat(message) {
  return apiFetch('/ai-chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  });
}
