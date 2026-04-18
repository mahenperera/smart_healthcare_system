import { http } from "./http";

export const notificationApi = {
  /**
   * Fetch all notifications for a specific recipient email
   * @param {string} email
   */
  getNotificationsByRecipient: (email) => 
    http.get(`/api/notifications/recipient/${email}`),
};

export default notificationApi;
