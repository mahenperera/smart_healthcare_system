package com.shc.notification.service.impl;

import com.shc.notification.dto.NotificationRequest;
import com.shc.notification.model.Notification;
import com.shc.notification.repository.NotificationRepository;
import com.shc.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public void sendEmail(NotificationRequest request) {
        String status = "SENT";
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getRecipient());
            message.setSubject(request.getSubject());
            message.setText(request.getMessage());
            
            mailSender.send(message);
        } catch (Exception e) {
            status = "FAILED";
            System.err.println("Failed to send email: " + e.getMessage());
        } finally {
            Notification notification = new Notification(
                request.getRecipient(),
                request.getSubject(),
                request.getMessage(),
                status
            );
            notificationRepository.save(notification);
        }
    }

    @Override
    public List<Notification> getNotificationsByRecipient(String email) {
        return notificationRepository.findByRecipientOrderByTimestampDesc(email);
    }
}
