package com.shc.notification.service.impl;

import com.shc.notification.dto.NotificationRequestDTO;
import com.shc.notification.dto.NotificationSettingDTO;
import com.shc.notification.model.Notification;
import com.shc.notification.model.NotificationSetting;
import com.shc.notification.repository.NotificationRepository;
import com.shc.notification.repository.NotificationSettingRepository;
import com.shc.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationSettingRepository settingRepository;

    @Override
    public Notification createNotification(NotificationRequestDTO dto) {
        // Check if user has disabled this type of notification
        NotificationSetting setting = settingRepository.findByUserId(dto.getUserId()).orElseGet(() -> {
            NotificationSetting newSetting = new NotificationSetting();
            newSetting.setUserId(dto.getUserId());
            newSetting.setAppointmentAlertsEnabled(true);
            newSetting.setSystemAlertsEnabled(true);
            return settingRepository.save(newSetting);
        });

        if (dto.getType() == com.shc.notification.enums.NotificationType.APPOINTMENT && !setting.isAppointmentAlertsEnabled()) {
            return null; // Skip creating if disabled
        }
        if (dto.getType() == com.shc.notification.enums.NotificationType.SYSTEM && !setting.isSystemAlertsEnabled()) {
            return null; // Skip creating if disabled
        }

        Notification notification = new Notification();
        notification.setUserId(dto.getUserId());
        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setType(dto.getType());

        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Notification> getUnreadUserNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
    }

    @Override
    public void markAsRead(UUID id) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Override
    public NotificationSettingDTO getSettings(String userId) {
        NotificationSetting setting = settingRepository.findByUserId(userId).orElseGet(() -> {
            NotificationSetting newSetting = new NotificationSetting();
            newSetting.setUserId(userId);
            newSetting.setAppointmentAlertsEnabled(true);
            newSetting.setSystemAlertsEnabled(true);
            return settingRepository.save(newSetting);
        });

        NotificationSettingDTO dto = new NotificationSettingDTO();
        dto.setUserId(setting.getUserId());
        dto.setAppointmentAlertsEnabled(setting.isAppointmentAlertsEnabled());
        dto.setSystemAlertsEnabled(setting.isSystemAlertsEnabled());
        return dto;
    }

    @Override
    public NotificationSettingDTO updateSettings(String userId, NotificationSettingDTO dto) {
        NotificationSetting setting = settingRepository.findByUserId(userId).orElseGet(() -> {
            NotificationSetting newSetting = new NotificationSetting();
            newSetting.setUserId(userId);
            return newSetting;
        });

        setting.setAppointmentAlertsEnabled(dto.isAppointmentAlertsEnabled());
        setting.setSystemAlertsEnabled(dto.isSystemAlertsEnabled());
        settingRepository.save(setting);

        return dto;
    }

    @Override
    public void deleteNotification(UUID id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public void deleteAllUserNotifications(String userId) {
        List<Notification> all = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notificationRepository.deleteAll(all);
    }
}
