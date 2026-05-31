// API Configuration
export const API_BASE_URL = 'http://localhost:3000/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  SIGNIN: `${API_BASE_URL}/auth/signin`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  SIGNOUT: `${API_BASE_URL}/auth/signout`,
  UPDATE_USER: `${API_BASE_URL}/user/update`,
  DELETE_USER: `${API_BASE_URL}/user/delete`,
};

// Order endpoints
export const ORDER_ENDPOINTS = {
  BASE: `${API_BASE_URL}/order`,
  CREATE: `${API_BASE_URL}/order/create`,
  GET_ALL: `${API_BASE_URL}/order`,
  GET_BY_ID: (id) => `${API_BASE_URL}/order/${id}`,
  GET_BY_ORDER_ID: (orderId) => `${API_BASE_URL}/order/order-id/${orderId}`,
  UPDATE: (id) => `${API_BASE_URL}/order/${id}`,
  UPDATE_STATUS: (id) => `${API_BASE_URL}/order/${id}/status`,
  DELETE: (id) => `${API_BASE_URL}/order/${id}`,
  STATS: `${API_BASE_URL}/order/stats`,
  USER_ORDERS: (userId) => `${API_BASE_URL}/order/user/${userId}`,
  EXPORT: `${API_BASE_URL}/order/export`,
};

