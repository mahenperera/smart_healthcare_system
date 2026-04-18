package com.shc.notification.controller;

import com.shc.notification.dto.NotificationRequest;
import com.shc.notification.model.Notification;
import com.shc.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest request) {
        try {
            notificationService.sendEmail(request);
            return ResponseEntity.ok("Notification sent successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/recipient/{email}")
    public List<Notification> getNotifications(@PathVariable String email) {
        return notificationService.getNotificationsByRecipient(email);
    }
}
