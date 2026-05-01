package com.shc.notification.dto;

import com.shc.notification.enums.NotificationType;

public class NotificationRequestDTO {
    private String userId;
    private String title;
    private String message;
    private NotificationType type;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
}
