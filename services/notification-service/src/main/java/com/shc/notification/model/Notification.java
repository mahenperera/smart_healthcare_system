package com.shc.notification.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import com.shc.notification.enums.NotificationType;

@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;

    private String userId; // Can be a doctor or patient UUID
    
    private String title;
    
    @Column(length = 1000)
    private String message;
    
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    
    private boolean isRead;
    
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        createdAt = LocalDateTime.now();
        isRead = false;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
    
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
