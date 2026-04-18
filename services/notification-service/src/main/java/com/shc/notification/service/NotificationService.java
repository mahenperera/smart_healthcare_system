package com.shc.notification.service;

import com.shc.notification.dto.NotificationRequest;
import com.shc.notification.model.Notification;
import java.util.List;

public interface NotificationService {
    void sendEmail(NotificationRequest request);
    List<Notification> getNotificationsByRecipient(String email);
}
