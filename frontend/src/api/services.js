import api from './axios';

export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export const tripService = {
  getAll: (params) => api.get('/api/trips', { params }),
  getById: (id) => api.get(`/api/trips/${id}`),
  create: (data) => api.post('/api/trips', data),
  update: (id, data) => api.put(`/api/trips/${id}`, data),
  delete: (id) => api.delete(`/api/trips/${id}`),
};

export const joinRequestService = {
  create: (data) => api.post('/api/join-requests', data),
  getByTrip: (tripId) => api.get(`/api/join-requests/trip/${tripId}`),
  getByUser: (userId) => api.get(`/api/join-requests/user/${userId}`),
  approve: (id) => api.put(`/api/join-requests/${id}/approve`),
  reject: (id) => api.put(`/api/join-requests/${id}/reject`),
};

export const chatService = {
  getMessages: (tripId) => api.get(`/api/chat/trips/${tripId}/messages`),
};

export const reviewService = {
  create: (data) => api.post('/api/reviews', data),
  getByUser: (userId) => api.get(`/api/reviews/user/${userId}`),
  getAverage: (userId) => api.get(`/api/reviews/user/${userId}/average`),
};

export const notificationService = {
  getByUser: (userId) => api.get(`/api/notifications/user/${userId}`),
};
