package com.shc.notification.controller;

import com.shc.notification.dto.NotificationRequestDTO;
import com.shc.notification.dto.NotificationSettingDTO;
import com.shc.notification.model.Notification;
import com.shc.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody NotificationRequestDTO dto) {
        Notification notification = notificationService.createNotification(dto);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadUserNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUnreadUserNotifications(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/settings/{userId}")
    public ResponseEntity<NotificationSettingDTO> getSettings(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getSettings(userId));
    }

    @PutMapping("/settings/{userId}")
    public ResponseEntity<NotificationSettingDTO> updateSettings(
            @PathVariable String userId, 
            @RequestBody NotificationSettingDTO dto) {
        return ResponseEntity.ok(notificationService.updateSettings(userId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteAllUserNotifications(@PathVariable String userId) {
        notificationService.deleteAllUserNotifications(userId);
        return ResponseEntity.ok().build();
    }
}
