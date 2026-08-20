import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('token');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authService = {
  register: (email, password, firstName, lastName, phoneNumber, address) =>
    apiClient.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
    }),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getProfile: () => apiClient.get('/auth/profile'),
};

// Products
export const productService = {
  getProducts: (category = null) =>
    apiClient.get('/products', { params: { category } }),
  getProductById: (id) => apiClient.get(`/products/${id}`),
  syncFromClover: (merchantId, accessToken) =>
    apiClient.post('/products/sync', { merchantId, accessToken }),
  createProduct: (product) => apiClient.post('/products', product),
  updateProduct: (id, product) => apiClient.put(`/products/${id}`, product),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};

// Orders
export const orderService = {
  createOrder: (items, shippingAddress, merchantId, accessToken) =>
    apiClient.post('/orders', {
      items,
      shippingAddress,
      merchantId,
      accessToken,
    }),
  getOrders: () => apiClient.get('/orders'),
  updateOrderStatus: (orderId, status) =>
    apiClient.patch(`/orders/${orderId}/status`, { status }),
};

// Campaigns
export const campaignService = {
  createCampaign: (name, content, type) =>
    apiClient.post('/campaigns', { name, content, type }),
  sendCampaign: (campaignId, targetAudience) =>
    apiClient.post(`/campaigns/${campaignId}/send`, { targetAudience }),
  getCampaigns: () => apiClient.get('/campaigns'),
};

// Users
export const userService = {
  getUsers: () => apiClient.get('/users'),
  getUserById: (id) => apiClient.get(`/users/${id}`),
  createUser: (email, password, firstName, lastName, phoneNumber, address, role) =>
    apiClient.post('/users', { email, password, firstName, lastName, phoneNumber, address, role }),
  updateUser: (id, firstName, lastName, phoneNumber, address, role, emailVerified) =>
    apiClient.put(`/users/${id}`, { firstName, lastName, phoneNumber, address, role, emailVerified }),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
};

export default apiClient;
