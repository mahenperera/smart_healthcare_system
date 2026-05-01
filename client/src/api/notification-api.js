import { http } from "./http";

export const notificationApi = {
  getUserNotifications: (userId) => http.get(`/api/notifications/user/${userId}`),
  getUnreadUserNotifications: (userId) => http.get(`/api/notifications/user/${userId}/unread`),
  markAsRead: (id) => http.put(`/api/notifications/${id}/read`),
  markAllAsRead: (userId) => http.put(`/api/notifications/user/${userId}/read-all`),
  
  getSettings: (userId) => http.get(`/api/notifications/settings/${userId}`),
  updateSettings: (userId, payload) => http.put(`/api/notifications/settings/${userId}`, payload),
  delete: (id) => http.delete(`/api/notifications/${id}`),
  deleteAll: (userId) => http.delete(`/api/notifications/user/${userId}`),
};
