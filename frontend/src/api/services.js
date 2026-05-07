import api from './axios';

export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
};

export const tripService = {
  getAll: (params) => api.get('/api/trips', { params }),
  getById: (id) => api.get(`/api/trips/${id}`),
  create: (data) => api.post('/api/trips', data),
  update: (id, data) => api.put(`/api/trips/${id}`, data),
  delete: (id) => api.delete(`/api/trips/${id}`),
  complete: (id) => api.put(`/api/trips/${id}/complete`),
};

export const joinRequestService = {
  create: (data) => api.post('/api/join-requests', data),
  getByTrip: (tripId) => api.get(`/api/join-requests/trip/${tripId}`),
  getByUser: (userId) => api.get(`/api/join-requests/user/${userId}`),
  approve: (id) => api.put(`/api/join-requests/${id}/approve`),
  reject: (id) => api.put(`/api/join-requests/${id}/reject`),
  remove: (id) => api.put(`/api/join-requests/${id}/remove`),
  isApprovedForTrip: (tripId) => api.get(`/api/join-requests/trip/${tripId}/me/approved`),
};

export const chatService = {
  getMessages: (tripId) => api.get(`/api/chat/trips/${tripId}/messages`),
};

export const reviewService = {
  create: (data) => api.post('/api/reviews', data),
  getByUser: (userId) => api.get(`/api/reviews/user/${userId}`),
  getAverage: (userId) => api.get(`/api/reviews/user/${userId}/average`),
  createDestination: (data) => api.post('/api/reviews/destinations', data),
  getByDestination: (destination) => api.get(`/api/reviews/destinations/${encodeURIComponent(destination)}`),
};

export const userService = {
  getById: (id) => api.get(`/api/users/${id}`),
  update: (id, data) => api.put(`/api/users/${id}`, data),
};

export const notificationService = {
  getByUser: (userId) => api.get(`/api/notifications/user/${userId}`),
};
