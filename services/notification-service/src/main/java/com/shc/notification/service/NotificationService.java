package com.shc.notification.service;

import com.shc.notification.dto.NotificationRequestDTO;
import com.shc.notification.dto.NotificationSettingDTO;
import com.shc.notification.model.Notification;
import com.shc.notification.model.NotificationSetting;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    Notification createNotification(NotificationRequestDTO dto);
    List<Notification> getUserNotifications(String userId);
    List<Notification> getUnreadUserNotifications(String userId);
    void markAsRead(UUID id);
    void markAllAsRead(String userId);
    void deleteNotification(UUID id);
    void deleteAllUserNotifications(String userId);
    
    NotificationSettingDTO getSettings(String userId);
    NotificationSettingDTO updateSettings(String userId, NotificationSettingDTO dto);
}
